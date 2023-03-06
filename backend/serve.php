<?php
namespace tide;

require_once(__DIR__ . "/cors.php");

if (empty($_GET["location"]))
    exit(0);

$location = $_GET["location"];

$days = 7;
if (!empty($_GET["days"]))
    $days = (int) $_GET["days"];

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

    echo json_encode(array_slice(array_values($callback), 0, $days));
} else {
    http_response_code(404);
}