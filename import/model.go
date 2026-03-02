package main

type TideDate struct {
	Date  string `json:"date"`
	Items []Tide `json:"items"`
}

type Tide struct {
	State     string  `json:"state"`
	Timestamp string  `json:"timestamp"`
	Height    float64 `json:"height,omitempty"`
}

type Location struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
