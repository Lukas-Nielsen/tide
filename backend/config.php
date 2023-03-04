<?php

namespace tide;

require_once(__DIR__ . "/db.php");

require_once(__DIR__ . "/cors.php");

header("Content-Type: application/json");

class config extends database
{
    protected const DECLARE_CONFIG = "SET @config = :config;";
    protected const INSERT_UPDATE = "INSERT INTO tide__config (siteId, tappId, config) VALUES (:siteId, :tappId, @config) ON DUPLICATE KEY UPDATE config=@config;";
    protected const SELECT = "SELECT config FROM tide__config WHERE siteId = :siteId AND tappId = :tappId;";
    protected const CREATE = "CREATE TABLE IF NOT EXISTS tide__config (`siteId` varchar(11) NOT NULL, `tappId` mediumint(7) DEFAULT NULL, `config` json NOT NULL, UNIQUE(`siteId`, `tappId`));";

    /**
     * init import
     */
    public function __construct()
    {
        parent::__construct();
        if (!$this->query(self::CREATE)) {
            http_response_code(500);
            error_log("import.php error creating table");
            exit();
        }
    }

    /**
     * validate user
     * @param string $token tobit access token
     * @param string $locationId
     * @return bool
     */
    protected function validate_user(string $token, string $locationId): bool
    {
        $url = "https://api.chayns.net/v2.0/{$locationId}/AccessToken?RequiredUacGroups=[1,3]";
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, ["Authorization: Bearer {$token}"]);

        $resp = curl_exec($curl);
        if (!curl_errno($curl)) {
            $info = curl_getinfo($curl);
            if ($info["http_code"] === 200) {
                return true;
            }
        }
        curl_close($curl);
        return false;
    }

    /**
     * run the import
     */
    public function run()
    {
        if (empty($_SERVER["REQUEST_METHOD"]) || !in_array($_SERVER["REQUEST_METHOD"], ["PUT", "GET"])) {
            http_response_code(405);
            echo json_encode("method must be 'GET' or 'PUT'");
            exit();
        }

        if (empty($_GET["siteId"]) || empty($_GET["tappId"])) {
            http_response_code(400);
            echo json_encode("missing paramter 'siteId' or 'tappId'");
            exit(0);
        }

        $siteId = $_GET["siteId"];
        $tappId = $_GET["tappId"];

        if ($_SERVER["REQUEST_METHOD"] === "GET") {
            $data = $this->fetch_assoc(self::SELECT, ["siteId" => $siteId, "tappId" => $tappId]);
            if ($data !== false) {
                echo $data["config"];
                exit(0);
            }
            http_response_code(404);
            echo json_encode("no config saved");
            exit(0);
        }

        if ($_SERVER["REQUEST_METHOD"] === "PUT") {
            if (empty($_GET["locationId"])) {
                http_response_code(400);
                echo json_encode("missing parameter 'locationId'");
                exit(0);
            }
            $locationId = $_GET["locationId"];
            if (!empty($_SERVER["HTTP_X_CHAYNS_TOKEN"])) {
                $chaynsToken = $_SERVER["HTTP_X_CHAYNS_TOKEN"];
                if ($this->validate_user($chaynsToken, $locationId)) {
                    $data = $this->get_data();
                    if ($data !== false) {
                        if ($this->query(self::DECLARE_CONFIG, ["config" => $data])) {
                            if ($this->query(self::INSERT_UPDATE, ["siteId" => $siteId, "tappId" => $tappId])) {
                                exit(0);
                            }
                        }
                        http_response_code(500);
                        echo json_encode("error setting config");
                        exit(0);
                    } else {
                        http_response_code(400);
                        echo json_encode("error in given config");
                        exit(0);
                    }
                } else {
                    http_response_code(403);
                    echo json_encode("you have no permission to change the config");
                    exit(0);
                }
            } else {
                http_response_code(401);
                echo json_encode("header 'x-chayns-token' is missing");
                exit(0);
            }
        }
    }

    /**
     * get posted data
     * @return false|string
     */
    protected function get_data()
    {
        $data = file_get_contents("php://input");
        if ($data === false)
            return false;

        if (strlen($data) === 0)
            return false;

        return $data;
    }
}

(new config())->run();