<?php

namespace tide;

require_once(__DIR__ . "/db.php");

class import extends database
{

    protected int $year;
    protected const TOKEN = "";
    protected const INSERT = "INSERT INTO tide (location, timestamp, state, height) VALUES (:location, :timestamp, :state, :height)";
    protected const DELETE = "DELETE FROM tide WHERE location = :location AND timestamp LIKE CONCAT(:year, '%')";

    /**
     * init import
     */
    public function __construct()
    {
        parent::__construct();
        $this->year = (int) date("m") === 12 ? (int) date("Y") + 1 : (int) date("Y");
        if (!$this->query("CREATE TABLE tide IF NOT EXISTS (`location` smallint(3) UNSIGNED NOT NULL, `timestamp` timestamp DEFAULT NULL, `state` enum('H','N') NOT NULL, `height` float NOT NULL);")) {
            http_response_code(500);
            error_log("import.php error creating table");
            exit();
        }
    }

    /**
     * perform request
     * @param string $url url to fetch from
     * @return bool|string
     */
    protected function request(string $url)
    {
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $resp = curl_exec($curl);
        if (!curl_errno($curl)) {
            $info = curl_getinfo($curl);
            if ($info["http_code"] === 200) {
                return $resp;
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
        if (empty($_SERVER["REQUEST_METHOD"]) || $_SERVER["REQUEST_METHOD"] !== "POST") {
            http_response_code(405);
            echo "method must be 'POST'";
            exit();
        }
        if (empty(self::TOKEN)) {
            error_log("import.php: please define a token");
        }
        if (empty($_SERVER["HTTP_X_TIDE_TOKEN"]) || empty(self::TOKEN) || $_SERVER["HTTP_X_TIDE_TOKEN"] !== self::TOKEN) {
            http_response_code(400);
            echo "token is missing or does not match";
            exit();
        }
        if (!empty($_GET["location"]) && ctype_digit($_GET["location"])) {
            $location = (int) $_GET["location"];
        } else {
            http_response_code(400);
            echo "query parameter 'location' is missing or is not an integer";
            exit();
        }

        if (
            !$this->query(self::DELETE, [
                "location" => $location,
                "year" => $this->year
            ])
        ) {
            error_log("error deleting data");
        }

        $data = $this->get_data();

        if ($data !== false) {
            foreach ($data as $entry) {
                if (
                    !$this->query(self::INSERT, [
                        "location" => $location,
                        "timestamp" => $entry["timestamp"],
                        "state" => $entry["state"],
                        "height" => $entry["height"]
                    ])
                ) {
                    error_log("error deleting data");
                }
            }
        } else {
            http_response_code(400);
            echo "no data given";
            exit();
        }
    }

    /**
     * get posted data
     * @return false|array
     */
    protected function get_data()
    {
        $data = file_get_contents("php://input");
        if ($data === false)
            return false;

        if (strlen($data) === 0)
            return false;

        return json_decode($data, true);
    }
}

(new import())->run();