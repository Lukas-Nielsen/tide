<?php

namespace tide;

require_once(__DIR__ . "/db.php");

class import extends database
{

    protected int $year;
    protected const CONF_URL = "https://raw.githubusercontent.com/Lukas-Nielsen/tide-import/main/location.json";
    protected const DB_FILE = __DIR__ . "/tide.db";
    protected const INSERT = "INSERT INTO tide (location, timestamp, state) VALUES (:location, :timestamp, :state)";
    protected const DELETE = "DELETE FROM tide WHERE location = :location AND timestamp LIKE :year || '%'";

    /**
     * init import
     * @param string $file path to db file
     */
    public function __construct()
    {
        parent::__construct(self::DB_FILE);
        $this->year = (int) date("m") === 12 ? (int) date("Y") + 1 : (int) date("Y");
        if (!$this->query("CREATE TABLE IF NOT EXISTS tide (location integer, timestamp text, state text);")) {
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
        $conf = $this->get_conf();
        if ($conf !== false) {
            foreach ($conf as $location) {
                $parsed = $this->get_parsed();
                if ($parsed === false || !in_array($location["id"], $parsed)) {
                    $this->query(self::DELETE, [
                        "location" => $location["id"],
                        "year" => $this->year
                    ]);
                    $data = $this->get_data($location["id"]);
                    if ($data !== false) {
                        foreach ($data as $row) {
                            $row = explode("#", $row);
                            if (sizeof($row) >= 12) {
                                $this->query(self::INSERT, [
                                    "location" => $location["id"],
                                    "timestamp" => date("Y-m-d H:i", strtotime(str_replace(" ", "0", $row[5]) . " " . str_replace(" ", "0", $row[6]))),
                                    "state" => $row[3]
                                ]);
                            }
                        }
                    }
                }
                $parsed[] = $location["id"];
                $this->put_parsed($parsed);
            }
        }
    }

    /**
     * get conf from github
     * @return array|false
     */
    protected function get_conf(): array |bool
    {
        $result = $this->request(self::CONF_URL);
        if ($result !== false)
            return json_decode($result, true);

        return false;
    }

    /**
     * get allready parsed locations
     * @return array|false
     */
    protected function get_parsed(): array |bool
    {
        $file = __DIR__ . "/{$this->year}.json";
        if (!file_exists($file)) {
            return false;
        }
        return json_decode(file_get_contents($file), true);

    }

    /**
     * update allready parsed locations
     * @param array $data allready parsed locations
     * @return array|false
     */
    protected function put_parsed(array $data): array |bool
    {
        try {
            return file_put_contents(__DIR__ . "/{$this->year}.json", json_encode($data, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            $this->log("error putting parsed");
            return false;
        }
    }

    /**
     * get data of given location
     * @param int $location
     * @return array|false
     */
    protected function get_data(int $location): array |bool
    {
        $result = $this->request("https://filebox.bsh.de/index.php/s/SbJ3z5NBkpOZloY/download?path=%2Fvb_hwnw%2Fdeu{$this->year}&files=DE__{$location}P{$this->year}.txt");
        if ($result !== false)
            return explode("\n", $result);

        return false;
    }
}

(new import())->run();