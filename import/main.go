package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-resty/resty/v2"
	"golang.org/x/text/encoding/charmap"
	"golang.org/x/text/transform"
)

type tide struct {
	State     string  `json:"state"`
	Timestamp string  `json:"timestamp"`
	Height    float64 `json:"height,omitempty"`
}

type location struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

const (
	BSH_TIMESTAMP = "02.01.2006 15:04"
	FILE_DATE     = "2006-01-02"
	FILE_TIME     = "15:04"
)

func main() {
	locations := make(map[string]location)
	for year := time.Now().Year(); year < time.Now().Year()+2; year++ {
		for id := 1; id < 1000; id++ {
			data, err := getData(year, id)
			result := make(map[string][]tide)
			if err == nil {
				for _, row := range data {
					row := row
					rowArray := strings.Split(row, "#")
					if rowArray[0] == "A04" {
						locations[fmt.Sprint(id)] = location{ID: id, Name: rowArray[2]}
					}
					if len(rowArray) >= 12 {
						timestamp, err := time.Parse(BSH_TIMESTAMP, strings.ReplaceAll(rowArray[5], " ", "0")+" "+strings.ReplaceAll(rowArray[6], " ", "0"))
						if err == nil {
							entryDate := timestamp.Format(FILE_DATE)
							entryTime := timestamp.Format(FILE_TIME)
							temp := tide{
								State:     rowArray[3],
								Timestamp: entryDate + "T" + entryTime + "+01:00",
							}
							height, err := strconv.ParseFloat(strings.TrimSpace(rowArray[7]), 64)
							if err == nil {
								temp.Height = height
							}

							result[entryDate] = append(result[entryDate], temp)
						}
					}
				}
				jsonResult, err := json.Marshal(result)
				path := "../frontend/public/data/" + fmt.Sprint(year)
				file := path + "/" + fmt.Sprint(id) + ".json"
				if err == nil {
					os.MkdirAll(path, 0750)
					os.WriteFile(file, jsonResult, 0644)
				}
			}
		}
	}
	jsonResult, err := json.Marshal(locations)
	path := "../frontend/public/data"
	file := path + "/locations.json"
	if err == nil {
		os.MkdirAll(path, 0750)
		os.WriteFile(file, jsonResult, 0644)
	}
}

func getData(year int, id int) ([]string, error) {
	yearStr := fmt.Sprint(year)
	url := "https://filebox.bsh.de/index.php/s/SbJ3z5NBkpOZloY/download?path=%2Fvb_hwnw%2Fdeu" + yearStr + "&files=DE__" + fmt.Sprint(id) + "P" + yearStr + ".txt"

	client := resty.New()
	req := client.R()

	resp, err := req.Get(url)
	if err != nil {
		return []string{}, err
	}
	if resp.IsError() {
		return []string{}, fmt.Errorf(resp.String())
	}
	return strings.Split(UTF8(resp.String()), "\n"), nil
}

func UTF8(text string) string {
	reader := transform.NewReader(strings.NewReader(text), charmap.Windows1252.NewDecoder())
	decBytes, _ := io.ReadAll(reader)
	return string(decBytes)
}
