import React, { useEffect, useState } from 'react';
import { Accordion, SelectButton, SmallWaitCursor } from 'chayns-components';
import './../index.css';
import locations from '../../location.json';

const App = () => {
    const selectDisplayDays = [
        {
            value: 1,
            name: '1 Tag',
        },
        {
            value: 3,
            name: '3 Tage',
        },
        {
            value: 5,
            name: '5 Tage',
        },
        {
            value: 7,
            name: '1 Woche',
        },
        {
            value: 14,
            name: '2 Wochen',
        },
        {
            value: 21,
            name: '3 Wochen',
        },
        {
            value: 28,
            name: '4 Wochen',
        },
    ];

    const states = {
        H: 'HW',
        N: 'NW',
    };

    const [data, setData] = useState([]);
    const [displayDays, setDisplayDays] = useState(
        JSON.parse(localStorage.getItem('tide-displayDays')) || 7
    );
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(
        JSON.parse(localStorage.getItem('tide-location')) || {
            id: 635,
            displayName: 'Dagebüll',
        }
    );

    useEffect(() => {
        setLoading(true);
        fetch(`https://tide.lukasnielsen.de/serve.php?location=` + location.id)
            .then((response) => {
                return response.json();
            })
            .then((actualData) => {
                setData(actualData.slice(0, displayDays));
            })
            .catch((err) => {
                setData(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [location, displayDays]);

    return (
        <div>
            {loading && (
                <div className="loading">
                    <SmallWaitCursor show={loading} />
                </div>
            )}
            {!loading && (
                <>
                    <h1>Eistellungen</h1>
                    <div class="settings">
                        <SelectButton
                            label={location.displayName}
                            title={'wähle einen Ort'}
                            list={locations}
                            listKey={'id'}
                            listValue={'displayName'}
                            defaultValue={location.id}
                            onSelect={(event) => {
                                setLocation({
                                    id: event.selection[0].id,
                                    displayName: event.selection[0].displayName,
                                });
                                localStorage.setItem(
                                    'tide-location',
                                    JSON.stringify({
                                        id: event.selection[0].id,
                                        displayName:
                                            event.selection[0].displayName,
                                    })
                                );
                            }}
                            quickFind={true}
                        />
                        <SelectButton
                            label={
                                selectDisplayDays.find(
                                    (elem) => elem.value === displayDays
                                ).name
                            }
                            title={'Tage zum Anzeigen'}
                            list={selectDisplayDays}
                            listKey={'value'}
                            listValue={'name'}
                            defaultValue={displayDays}
                            onSelect={(event) => {
                                setDisplayDays(event.selection[0].value);
                                localStorage.setItem(
                                    'tide-displayDays',
                                    JSON.stringify(event.selection[0].value)
                                );
                            }}
                        />
                    </div>
                </>
            )}
            {!loading && data && <h1>Gezeiten - {location.displayName}</h1>}
            {!loading && !data && <h3>Fehler</h3>}
            {!loading &&
                data &&
                data.map((day, index) => {
                    let date = new Date(day[0].timestamp);
                    return (
                        <Accordion
                            defaultOpened={index == 0 ? true : false}
                            key={day[0].timestamp}
                            head={date.toLocaleDateString(
                                navigator.languages &&
                                    navigator.languages.length
                                    ? navigator.languages[0]
                                    : navigator.language,
                                {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }
                            )}
                            dataGroup={'gezeiten'}
                        >
                            <table>
                                <thead>
                                    <tr>
                                        <th className="table-col-time">
                                            Uhrzeit
                                        </th>
                                        <th className="table-col-height">
                                            Wasserstand
                                        </th>
                                        <th className="table-col-state">
                                            &nbsp;
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.map((event) => {
                                        let time = new Date(event.timestamp);
                                        return (
                                            <tr key={event.timestamp}>
                                                <td>
                                                    {time.toLocaleTimeString(
                                                        navigator.languages &&
                                                            navigator.languages
                                                                .length
                                                            ? navigator
                                                                  .languages[0]
                                                            : navigator.language,
                                                        {
                                                            hour: 'numeric',
                                                            minute: 'numeric',
                                                        }
                                                    )}
                                                </td>
                                                <td>
                                                    {event.height === 0 &&
                                                        'unbekannt'}
                                                    {event.height !== 0 &&
                                                        event.height.toFixed(
                                                            2
                                                        ) + 'm'}
                                                </td>
                                                <td>{states[event.state]}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </Accordion>
                    );
                })}
            <span>
                © {new Date().getFullYear()} by{' '}
                <a href="https://chayns.de/lukas.nielsen">Lukas Nielsen</a> -
                Daten vom <a href="https://www.bsh.de">BSH</a>
            </span>
        </div>
    );
};

export default App;
