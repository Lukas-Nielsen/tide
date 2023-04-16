<?php

namespace tide;

require_once(__DIR__ . "/db.php");

require_once(__DIR__ . "/cors.php");

header("Content-Type: application/json");

class config extends database
{
    protected const DECLARE_CONFIG = "SET @config = :config;";
    protected const INSERT_UPDATE = "INSERT INTO tide__config (siteId, deviceId, config) VALUES (:siteId, :deviceId, @config) ON DUPLICATE KEY UPDATE config=@config;";
    protected const SELECT_SINGLE = "SELECT config FROM tide__config WHERE siteId = :siteId AND deviceId = :deviceId;";
    protected const SELECT_ALL = "SELECT config, deviceId FROM tide__config WHERE siteId = :siteId";
    protected const DELETE = "DELETE FROM tide__config WHERE siteId = :siteId AND deviceId = :deviceId";
    protected const CREATE = "CREATE TABLE IF NOT EXISTS tide__config (`siteId` varchar(11) NOT NULL, `deviceId` varchar(20) NOT NULL, `config` json DEFAULT NULL, UNIQUE(`siteId`, `deviceId`));";

    protected string $deviceId;
    protected string $siteId;

    /**
     * init config
     */
    public function __construct()
    {
        parent::__construct();
        if (!$this->query(self::CREATE)) {
            http_response_code(500);
            error_log("config.php error creating table");
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
     * handle request
     */
    public function handle_request()
    {
        if (empty($_GET["siteId"]) || empty($_GET["deviceId"])) {
            http_response_code(400);
            echo json_encode("missing paramter 'siteId' or 'deviceId'");
            exit(0);
        }

        $this->siteId = $_GET["siteId"];
        $this->deviceId = $_GET["deviceId"];

        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET":
                $this->handle_get();
                break;
            case "PUT":
                $this->handle_put();
                break;
            case "DELETE":
                $this->handle_delete();
                break;

            default:
                http_response_code(405);
                echo json_encode("method not allowed");
                exit();
        }
    }

    /**
     * handle get
     * @return void
     */
    protected function handle_get()
    {
        if ($this->deviceId === "all") {
            $data = $this->fetch_assoc_array(self::SELECT_ALL, ["siteId" => $this->siteId]);
            if ($data !== false) {
                $callback = [];
                foreach ($data as $row) {
                    if ($row["config"] !== null) {
                        $callback[] = json_decode($row["config"], true);
                    } else {
                        $callback[] = [
                            "deviceId" => $row["deviceId"],
                            "fontSize" => 1,
                            "name" => "",
                            "location" => 635
                        ];
                    }
                }

                echo json_encode($callback);
                exit(0);
            }
            http_response_code(404);
            echo json_encode("no config saved");
            exit(0);
        } else {
            $data = $this->fetch_assoc(self::SELECT_SINGLE, ["siteId" => $this->siteId, "deviceId" => $this->deviceId]);
            if ($data !== false && $data["config"] !== null) {
                echo $data["config"];
                exit(0);
            }
            if ($this->query(self::DECLARE_CONFIG, ["config" => null])) {
                $this->query(self::INSERT_UPDATE, ["siteId" => $this->siteId, "deviceId" => $this->deviceId]);
            }
            http_response_code(404);
            echo json_encode("no config saved");
            exit(0);
        }
    }

    /**
     * handle put
     * @return void
     */
    protected function handle_put()
    {
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
                        if ($this->query(self::INSERT_UPDATE, ["siteId" => $this->siteId, "deviceId" => $this->deviceId])) {
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

    /**
     * handle delete
     * @return void
     */
    protected function handle_delete()
    {
        if (empty($_GET["locationId"])) {
            http_response_code(400);
            echo json_encode("missing parameter 'locationId'");
            exit(0);
        }
        $locationId = $_GET["locationId"];
        if (!empty($_SERVER["HTTP_X_CHAYNS_TOKEN"])) {
            $chaynsToken = $_SERVER["HTTP_X_CHAYNS_TOKEN"];
            if ($this->validate_user($chaynsToken, $locationId)) {
                if ($this->query(self::DELETE, ["siteId" => $this->siteId, "deviceId" => $this->deviceId])) {
                    exit(0);
                }
                http_response_code(500);
                echo json_encode("error removing device");
                exit(0);
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

(new config())->handle_request();