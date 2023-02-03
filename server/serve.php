<?php
namespace tide;

// cors
if (isset($_SERVER["HTTP_ORIGIN"]) && in_array($_SERVER["HTTP_ORIGIN"], ["https://chayns.space", "http://localhost:1234"])) {
    header("Access-Control-Allow-Origin: {$_SERVER["HTTP_ORIGIN"]}");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400");
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {

    if (isset($_SERVER["HTTP_ACCESS_CONTROL_REQUEST_METHOD"]))
        header("Access-Control-Allow-Methods: GET, OPTIONS");

    if (isset($_SERVER["HTTP_ACCESS_CONTROL_REQUEST_HEADERS"]))
        header("Access-Control-Allow-Headers: {$_SERVER["HTTP_ACCESS_CONTROL_REQUEST_HEADERS"]}");

    exit(0);
}

if (empty($_GET["location"]))
    exit(0);

$location = $_GET["location"];

header("Content-Type: application/json");

require_once("./db.php");

$db = new database();

$data = $db->fetch_assoc_array(
    "SELECT timestamp,
            state,
            height
        FROM tide
    WHERE timestamp > CURRENT_DATE
        AND location = :location
    ORDER BY timestamp
    LIMIT 150",
    [
        "location" => $location
    ]
);

if ($data !== false) {
    $callback = [];
    foreach ($data as $entry) {
        $datetime = new \DateTime($entry["timestamp"]);

        $callback[substr($entry["timestamp"], 0, 10)][] = [
            "timestamp" => $datetime->format(\DateTime::ATOM),
            "state" => $entry["state"],
            "height" => $entry["height"]
        ];
    }

    echo json_encode(array_values($callback));
} else {
    http_response_code(404);
}