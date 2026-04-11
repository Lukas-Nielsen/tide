package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"slices"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/go-resty/resty/v2"
	"golang.org/x/text/encoding/charmap"
	"golang.org/x/text/transform"
)

const (
	BSH_TIMESTAMP   = "02.01.2006 15:04"
	FILE_DATE       = "2006-01-02"
	FILE_TIME       = "15:04"
	TIMEZONE_OFFSET = "+01:00"
	BASE_URL        = "https://filebox.bsh.de/index.php/s/SbJ3z5NBkpOZloY/download?path=%2Fvb_hwnw%2Fdeu"
	OUT_ROOT        = "../public/data"
)

func main() {
	limitYear := time.Now().Year() + 1
	if time.Now().Month() == time.December {
		limitYear++
	}

	var (
		mu        sync.Mutex // protects locations slice
		locations []Location
	)

	workerCount := runtime.GOMAXPROCS(0)
	jobs := make(chan struct {
		year int
		id   int
	}, workerCount*2)
	var wg sync.WaitGroup

	// start workers
	for w := 0; w < workerCount; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for job := range jobs {
				locs, err := fetchTideData(job.year, job.id)
				if err != nil {
					log.Printf("year %d id %d: %v", job.year, job.id, err)
					continue
				}
				if len(locs) > 0 {
					mu.Lock()
					locations = append(locations, locs...)
					mu.Unlock()
				}
			}
		}()
	}

	// feed jobs
	for year := time.Now().Year(); year < limitYear; year++ {
		for id := 1; id < 1000; id++ {
			jobs <- struct{ year, id int }{year, id}
		}
	}
	close(jobs)
	wg.Wait()

	// write locations.json
	if err := writeJSON(filepath.Join(OUT_ROOT, "locations.json"), locations); err != nil {
		log.Fatalf("failed to write locations: %v", err)
	}
}

// fetchTideData downloads the raw file, parses it and writes the per‑year/id JSON.
// It returns a slice containing the location (if discovered) for the current id.
func fetchTideData(year, id int) ([]Location, error) {
	raw, err := getData(year, id)
	if err != nil {
		return nil, err
	}
	var (
		result    []TideDate
		locsFound []Location
	)

	for _, row := range raw {
		rowArray := strings.Split(row, "#")
		if len(rowArray) == 0 {
			continue
		}
		// Identify location name (record type A04)
		if rowArray[0] == "A04" && len(rowArray) > 2 {
			locsFound = append(locsFound, Location{ID: id, Name: rowArray[2]})
		}
		if len(rowArray) < 12 {
			continue
		}
		ts, err := time.Parse(BSH_TIMESTAMP,
			strings.ReplaceAll(rowArray[5], " ", "0")+" "+strings.ReplaceAll(rowArray[6], " ", "0"))
		if err != nil {
			continue // malformed timestamp – skip line
		}
		entryDate := ts.Format(FILE_DATE)
		entryTime := ts.Format(FILE_TIME)

		t := Tide{
			State:     rowArray[3],
			Timestamp: entryDate + "T" + entryTime + TIMEZONE_OFFSET,
		}
		if h, err := strconv.ParseFloat(strings.TrimSpace(rowArray[7]), 64); err == nil {
			t.Height = h
		}

		idx := slices.IndexFunc(result, func(e TideDate) bool { return e.Date == entryDate })
		if idx == -1 {
			result = append(result, TideDate{Date: entryDate, Items: []Tide{t}})
		} else {
			result[idx].Items = append(result[idx].Items, t)
		}
	}

	// write the per‑year/id JSON file
	outPath := filepath.Join(OUT_ROOT, fmt.Sprint(year), fmt.Sprint(id))
	if err := os.MkdirAll(outPath, 0o750); err != nil {
		return locsFound, fmt.Errorf("mkdir %s: %w", outPath, err)
	}
	if err := writeJSON(filepath.Join(outPath, "data.json"), result); err != nil {
		return locsFound, fmt.Errorf("write %s: %w", outPath, err)
	}
	return locsFound, nil
}

// writeJSON marshals v and atomically writes it to dest.
func writeJSON(dest string, v interface{}) error {
	b, err := json.Marshal(v)
	if err != nil {
		return fmt.Errorf("marshal json: %w", err)
	}
	tmp := dest + ".tmp"
	if err := os.WriteFile(tmp, b, 0o644); err != nil {
		return fmt.Errorf("write temp file: %w", err)
	}
	return os.Rename(tmp, dest)
}

// getData unchanged – only the signature comment is added.
func getData(year int, id int) ([]string, error) {
	yearStr := fmt.Sprint(year)
	url := fmt.Sprintf("%s&path=%%2Fvb_hwnw%%2Fdeu%s&files=DE__%dP%s.txt",
		BASE_URL, yearStr, id, yearStr)

	client := resty.New()
	resp, err := client.R().Get(url)
	if err != nil {
		return nil, err
	}
	if resp.IsError() {
		return nil, fmt.Errorf("%s", "keine Daten")
	}
	return strings.Split(UTF8(resp.String()), "\n"), nil
}

// UTF8 unchanged – helper for Windows‑1252 decoding.
func UTF8(text string) string {
	reader := transform.NewReader(strings.NewReader(text), charmap.Windows1252.NewDecoder())
	decBytes, _ := io.ReadAll(reader)
	return string(decBytes)
}
