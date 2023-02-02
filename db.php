<?php

namespace tide;

define("DB_NAME", "");
define("DB_HOST", "");
define("DB_USER", "");
define("DB_PASS", "");

class database
{

    protected \PDO $link;

    public ?int $last_errno;
    public array $last_error;
    public int $last_insert_id;
    public int $num_rows;

    /**
     * init db
     */
    public function __construct()
    {
        $this->link = new \PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST . ";charset=utf8mb4", DB_USER, DB_PASS);
        $this->link->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);
        $this->link->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->link->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

        if (mysqli_connect_errno()) {
            error_log("Problem with connecting to database.");
            exit(99);
        }
    }

    /**
     * reset properties
     */
    protected function reset()
    {
        $this->last_insert_id = 0;
        $this->last_errno = 0;
        $this->last_error = [];
        $this->num_rows = -1;
    }

    /**
     * execute query
     * @param string $sql query string
     * @param array $data data for query
     * @return bool
     */
    public function query(string $sql, array $data = []): bool
    {
        $this->reset();

        try {
            $stmt = $this->link->prepare($sql);
            $stmt->execute($data);
        } catch (\Throwable $th) {
            return false;
        }

        if (!in_array($stmt->errorCode(), ["00000", ""])) {
            $this->last_errno = $stmt->errorCode();
            $this->last_error = $stmt->errorInfo();
            return false;
        }

        $this->last_insert_id = $this->link->lastInsertId();
        $this->num_rows = $stmt->rowCount();

        return true;
    }

    /**
     * fetch single row
     * @param string $sql query string
     * @param array $data data for query
     * @return array|false
     */
    public function fetch_assoc(string $sql, array $data = []): array |bool
    {
        $this->reset();
        $stmt = $this->link->prepare($sql);
        $stmt->execute($data);

        if (!in_array($stmt->errorCode(), ["00000", ""])) {
            $this->last_errno = $stmt->errorCode();
            $this->last_error = $stmt->errorInfo();
            return false;
        }

        $this->num_rows = $stmt->rowCount();

        if ($this->num_rows == 0) {
            $this->last_error = ["no rows found"];
            return false;
        } else if ($this->num_rows > 1) {
            $this->last_error = ["more than 1 rows found"];
            return false;
        }

        $result = $stmt->fetchObject();

        return (array) $result;
    }

    /**
     * fetch multiple rows
     * @param string $sql query string
     * @param array $data data for query
     * @return array|false
     */
    public function fetch_assoc_array(string $sql, array $data = []): array |false
    {
        $this->reset();

        $stmt = $this->link->prepare($sql);
        $stmt->execute($data);

        if (!in_array($stmt->errorCode(), ["00000", ""])) {
            $this->last_errno = $stmt->errorCode();
            $this->last_error = $stmt->errorInfo();
            return false;
        }

        $this->num_rows = $stmt->rowCount();

        if ($this->num_rows == 0) {
            $this->last_error = ["no rows found"];
            return false;
        }

        $result = $this->unset_num_keys($stmt->fetchAll());

        return $result;
    }

    /**
     * remove numeric keys from array
     * @param array $data the result of fetch
     * @return array
     */
    protected function unset_num_keys(array $array)
    {
        $array_out = array();
        foreach ($array as $k => $v) {
            if (is_array($v)) {
                $array_out[$k] = $this->unset_num_keys($v);
            } elseif (!is_numeric($k)) {
                $array_out[$k] = $v;
            }
        }
        return $array_out;
    }
}