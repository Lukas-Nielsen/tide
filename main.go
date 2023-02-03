package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"strings"
	"time"

	"github.com/go-resty/resty/v2"
)

type tide struct {
	State     string `json:"state"`
	Timestamp string `json:"timestamp"`
	Height    string `json:"height"`
}

type conf struct {
	ID          int    `json:"id"`
	DisplayName string `json:"displayName"`
}

var (
	year         int
	backendUrl   string
	backendToken string
	confFile     string
	localConf    []conf
	err          error
)

const (
	CONF_URL      = "https://raw.githubusercontent.com/Lukas-Nielsen/tide-import/main/location.json"
	BSH_TIMESTAMP = "02.01.2006 15:04"
	DB_TIMESTAMP  = "2006-01-02 15:04"
)

func init() {
	flag.StringVar(&backendUrl, "url", "", "")
	flag.StringVar(&backendToken, "token", "", "")
	flag.StringVar(&confFile, "file", "", "")
	flag.Parse()
	if len(backendUrl) == 0 || len(backendToken) == 0 {
		log.Fatalln("please provide '--token' and '--url' optionaly: '--file'")
	}

	if time.Now().Month() == 12 {
		year = int(time.Now().Year()) + 1
	} else {
		year = time.Now().Year()
	}
}

func main() {

	if len(confFile) > 0 {
		content, err := ioutil.ReadFile(confFile)
		if err != nil {
			log.Fatal("error when opening file: ", err)
		}

		err = json.Unmarshal(content, &localConf)
		if err != nil {
			log.Fatal("Error during Unmarshal(): ", err)
		}
	} else {

		localConf, err = getConf()
		if err != nil {
			log.Fatalln("error getting config: ", err)
		}
	}

	for _, location := range localConf {
		location := location

		data, err := location.getData()
		if err != nil {
			log.Println("error getting data for location '"+location.DisplayName+"': ", err)
		}
		if len(data) == 0 {
			log.Println("no data for location '"+location.DisplayName+"': ", err)
		}

		var postData []tide

		for _, row := range data {
			row := row
			rowArray := strings.Split(row, "#")
			if len(rowArray) >= 12 {
				timestamp, err := time.Parse(BSH_TIMESTAMP, strings.ReplaceAll(rowArray[5], " ", "0")+" "+strings.ReplaceAll(rowArray[6], " ", "0"))
				if err == nil {
					postData = append(postData, tide{
						State:     rowArray[3],
						Timestamp: timestamp.Format(DB_TIMESTAMP),
						Height:    rowArray[7],
					})
				}
			}
		}

		location.postData(postData)

	}
}

func getConf() ([]conf, error) {
	var data []conf
	client := resty.New()

	resp, err := client.R().
		Get(CONF_URL)

	if err != nil {
		return []conf{}, err
	}
	if resp.IsError() {
		return []conf{}, fmt.Errorf(resp.String())
	}
	json.Unmarshal(resp.Body(), &data)
	return data, nil
}

func (c *conf) getData() ([]string, error) {
	year := fmt.Sprint(year)
	url := "https://filebox.bsh.de/index.php/s/SbJ3z5NBkpOZloY/download?path=%2Fvb_hwnw%2Fdeu" + year + "&files=DE__" + fmt.Sprint(c.ID) + "P" + year + ".txt"

	client := resty.New()
	resp, err := client.R().Get(url)
	if err != nil {
		return []string{}, err
	}
	if resp.IsError() {
		return []string{}, fmt.Errorf(resp.String())
	}
	return strings.Split(resp.String(), "\n"), nil
}

func (c *conf) postData(data []tide) {
	client := resty.New()
	resp, err := client.R().
		SetHeader("x-tide-token", backendToken).
		SetBody(&data).
		SetQueryParam("location", fmt.Sprint(c.ID)).
		Post(backendUrl)
	if err != nil {
		log.Println(err)
	}
	if resp.IsError() {
		log.Println(resp.String())
	}
}
