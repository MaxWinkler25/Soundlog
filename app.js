/* Max’s Soundlog: a browser-based, shareable listening archive. */
(() => {
  'use strict';
  const icons = {
    overview:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    tracks:'<path d="M9 18V5l10-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    artists:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5.5a3.2 3.2 0 0 1 0 6.2M17 14a5 5 0 0 1 4 5v1"/>',
    albums:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".7" fill="currentColor" stroke="none"/>',
    history:'<path d="M3 12a9 9 0 1 0 2.4-6.1L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    upload:'<path d="M12 16V3m-4 4 4-4 4 4"/><path d="M4 15v3.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V15"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    system:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    language:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    light:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',
    dark:'<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/>',
    down:'<path d="m7 10 5 5 5-5"/>',
    check:'<path d="m5 12 4 4 10-10"/>',
    sort:'<path d="M4 7h16M7 12h10M10 17h4"/>',
    right:'<path d="m9 6 6 6-6 6"/>',
    left:'<path d="m15 6-6 6 6 6"/>',
    arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
    close:'<path d="M6 6l12 12M18 6 6 18"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    play:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
    disc:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/>',
    search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    file:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h4M9 12h6M9 16h6"/>',
    external:'<path d="M13 5h6v6M19 5l-9 9"/><path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    download:'<path d="M12 3v13m-4-4 4 4 4-4"/><path d="M4 16v2.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V16"/>'
  };
  function icon(name, size=18) { return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ''}</svg>`; }
  const embeddedData = JSON.parse(document.getElementById('embedded-data').textContent);
  const coverCache = JSON.parse(document.getElementById('cached-covers').textContent);
  const $ = id => document.getElementById(id);
  function savedLanguage() {
    try { return localStorage.getItem('soundlog-language')==='de' ? 'de' : 'en'; } catch (_) { return 'en'; }
  }
  const state = { data:embeddedData, lang:savedLanguage(), view:'overview', range:'all', selectedDate:null, query:'', sort:'plays', page:1, derived:null, warnings:[], invalidFile:false };
  const messages = {
    en: {
      pageTitle:'Max’s Soundlog — My listening archive', description:'Explore the songs, artists, and albums Max has been listening to on Spotify.',
      mainNav:'Main navigation', brandHome:'Max’s Soundlog home', brandSub:'MAX’S ARCHIVE', library:"Max's Library",
      dateFilterTitle:'Last 7 and 30 days are measured from the latest recorded date.', dateFilterLabel:'Filter by date range', dateRangeShort:'Date range',
      allDates:'All dates', last7:'Last 7 days', last30:'Last 30 days', latestMonth:'Latest month',
      themeTitle:'Choose light, dark, or follow your device', themeLabel:'Color theme', themeSystem:'System', themeLight:'Light', themeDark:'Dark',
      languageTitle:'Choose a language', languageLabel:'Language', dialogLabel:'Listening details',
      navOverview:'Overview', navTracks:'Tracks', navArtists:'Artists', navAlbums:'Albums', navHistory:'Daily history',
      unknown:'Unknown', notProvided:'Not provided', noDates:'No dates in this range', unknownArtist:'Unknown artist', unknownAlbum:'Unknown album',
      showFor:'Showing data for', rawDay:'View raw day', clearDay:'Clear day ×',
      activity:'Listening activity', activitySub:'Reported playback across recorded days', lastRecorded:'LAST {count} RECORDED',
      playbackNotProvided:'playback not provided', durationPlayback:'{time} playback', exploreBar:'select to explore this day',
      chartFoot:'Based on the daily playbackMs value', howCalculated:'How is this calculated? ↗',
      topArtists:'Top artists', topArtistsSub:'The artists I keep coming back to', byPlays:'BY PLAYS', itemTimeSuffix:'item time',
      noArtists:'No artist entries in this range.', exploreArtists:'Explore all artists',
      knownItemTooltip:'{ms} of known item time; {entries} with unknown duration excluded.', detailsFor:'Details for {name}',
      recentTitle:'Recently logged', recentSub:'A look back at my latest listening days', historyBadge:'HISTORY', unknownPlays:'Unknown plays', playbackNoun:'playback',
      noDays:'No days in this range.', viewHistory:'View listening history',
      heroEyebrow:'A LITTLE SOMETHING FROM MAX', heroTitle:'A peek into <em>my listening.</em>',
      heroCopy:'Hey, I’m Max. Take a look at the songs, artists, and albums I’ve been listening to on Spotify.', dateRange:'DATE RANGE',
      disclaimer:'Listening stats aren’t live and may not include recent plays.', statsAria:'Listening summary',
      totalPlayback:'TOTAL PLAYBACK', totalPlays:'TOTAL PLAYS', uniqueItems:'UNIQUE ITEMS', uniqueArtists:'UNIQUE ARTISTS',
      dailyPlayback:'daily playback', unknownCount:'{count} unknown', knownCountsOnly:'known counts only', sumTrackCounts:'sum of track counts',
      tracksEpisodes:'tracks & episodes', differentTracks:'different tracks', differentArtists:'different artist entries',
      knownPlaybackTitle:'{ms} ms of known playback', unknownDaysTitle:'; {count} days unknown', unknownCountsTitle:'{count} entries have unknown counts', sumTrackCountsTitle:'Sum of count values in tracks',
      topTracks:'My top tracks', topTracksSub:'The tracks and episodes I play the most', viewAll:'View all',
      track:'TRACK', album:'ALBUM', plays:'PLAYS', itemTime:'ITEM TIME', noTracks:'No track entries in this range.', seeAllTracks:'See all tracks',
      footer:'Made by Max, for friends who love music.', libraryEyebrow:'MAX’S LISTENING LIBRARY',
      tracksTitle:'Tracks & episodes', tracksDesc:'A collection of the tracks and episodes I’ve been listening to. Select one to see the details.',
      artistsTitle:'My artists', artistsDesc:'The people behind my listening history, grouped by their original IDs.',
      albumsTitle:'Albums & shows', albumsDesc:'A closer look at the albums and shows in my collection.',
      historyTitle:'Daily history', historyDesc:'Follow along day by day and explore what I listened to.',
      uniqueItemsCount:'unique items', artistsCount:'artists', albumsCount:'albums & shows', recordedDaysCount:'recorded days',
      searchHistory:'Search dates, tracks, or artists…', searchArtists:'Search artists or Spotify URI…', searchAlbums:'Search albums, artists, or URI…', searchTracks:'Search tracks, artists, albums, or URI…',
      searchLabel:'Search', sortBy:'Sort by', sortAria:'Sort results', newest:'Newest first', oldest:'Oldest first', playbackTime:'Playback time', mostPlays:'Most plays', itemTimeSort:'Item time', nameSort:'Name A–Z', recentSort:'Recently logged',
      emptyHeading:'Nothing to show just yet', emptySearch:'Try a different search term.', emptySelection:'There are no entries for this selection.',
      date:'DATE', playback:'PLAYBACK', tracks:'TRACKS', artists:'ARTISTS', albums:'ALBUMS', trackEpisode:'TRACK / EPISODE', albumShow:'ALBUM / SHOW', artist:'ARTIST', lastLogged:'LAST LOGGED',
      rawDayAria:'View raw data for {date}', swipe:'Swipe sideways to see all columns →', showing:'Showing {start}–{end} of {total}', previousPage:'Previous page', nextPage:'Next page',
      historyMetric:'Playback is the original daily <code>playbackMs</code> value. * indicates a partial count where some values are unknown. Click a date to explore it.',
      itemMetric:'Select an item for its exact milliseconds, URI, and original values by date. Item time comes from each entry’s <code>ms</code> field and can differ from playback. * indicates a partial total.', learnMore:'Learn more',
      closeDetails:'Close details', categoryTrack:'TRACK / EPISODE', categoryArtist:'ARTIST', categoryAlbum:'ALBUM / SHOW', uriMissing:'Not present (see JSON key)',
      negativeDurationOne:' {entries} had a negative or missing duration and was excluded from the known total.', negativeDurationMany:' {entries} had a negative or missing duration and were excluded from the known total.',
      negativeCountOne:' {entries} had a negative or missing play count and was excluded from the known count.', negativeCountMany:' {entries} had a negative or missing play count and were excluded from the known count.',
      itemDetails:'Item details', knownItemTime:'KNOWN ITEM TIME', recordedDays:'RECORDED DAYS', originalMetadata:'Original identifiers & metadata', jsonKey:'JSON key', uriField:'URI field',
      artistLabel:'Artist', albumShowLabel:'Album / show', imageUrl:'Image URL', knownItemMs:'Known item ms',
      metadataHint:'Metadata above is from the most recent occurrence. Exact original values for every date are below.', byDate:'By date', originalMs:'ORIGINAL MS',
      rawJson:'View original JSON for each date', openSpotify:'Open in Spotify', close:'Close',
      dailyHistory:'DAILY HISTORY', dayDetailCopy:'A complete view of this day’s original data.', reportedPlayback:'REPORTED PLAYBACK', trackPlays:'TRACK PLAYS', items:'ITEMS', dateKey:'Date key', artistsLabel:'Artists', albumsShows:'Albums / shows', rawDayJson:'Original JSON for this day', exploreDay:'Explore this day',
      understanding:'UNDERSTANDING THE DATA', numbersTitle:'What do the numbers mean?', gotIt:'Got it',
      explainHtml:'<p><strong>Playback</strong> is the sum of the daily <code>playbackMs</code> values. A reported zero stays zero, even if that day has track entries.</p><p><strong>Plays</strong> are the sum of each track or episode’s <code>count</code>. Tracks, artists, and albums are grouped by their original JSON keys, not just by name.</p><p><strong>Item time</strong> is the sum of the <code>ms</code> values stored on that item. These values can differ from playback time; they are not treated as a substitute for it.</p><p>Negative or missing milliseconds are displayed as unknown and excluded from known totals. You can always open an item or day to see its exact original values and raw JSON.</p><p>“Last 7 days” and “Last 30 days” refer to calendar days counted back from the latest date in Max’s file.</p>',
      invalidFile:'The published data.json is invalid. Showing the copy embedded in the page instead.',
      loadingTitle:'Loading your listening archive…', loadingSubtitle:'Getting your music, stats, and listening history ready.',
      invalidRoot:'Expected a JSON object with dates as keys, such as "2026-08-03".', missingDates:'No valid dates found. Use dates in YYYY-MM-DD format as the top-level keys.',
      invalidDay:'{date} must contain a day object.', invalidCollection:'{date}.{type} must be an object keyed by an item ID or URI.', invalidEntry:'{date}.{type}[{key}] must be an object.',
      ignoredOne:'{count} top-level key was not a valid date and is not included in the views.', ignoredMany:'{count} top-level keys were not valid dates and are not included in the views.'
    },
    de: {
      pageTitle:'Max’ Soundlog — Mein Hörarchiv', description:'Entdecke die Songs, Künstler und Alben, die Max auf Spotify gehört hat.',
      mainNav:'Hauptnavigation', brandHome:'Max’ Soundlog Startseite', brandSub:'MAX’ ARCHIV', library:'Max’ Mediathek',
      dateFilterTitle:'Die letzten 7 bzw. 30 Tage werden vom neuesten aufgezeichneten Datum aus berechnet.', dateFilterLabel:'Nach Zeitraum filtern', dateRangeShort:'Zeitraum',
      allDates:'Alle Daten', last7:'Letzte 7 Tage', last30:'Letzte 30 Tage', latestMonth:'Letzter Monat',
      themeTitle:'Hell, Dunkel oder Geräteeinstellung auswählen', themeLabel:'Darstellung', themeSystem:'System', themeLight:'Hell', themeDark:'Dunkel',
      languageTitle:'Sprache auswählen', languageLabel:'Sprache', dialogLabel:'Hördetails',
      navOverview:'Übersicht', navTracks:'Titel', navArtists:'Künstler', navAlbums:'Alben', navHistory:'Hörverlauf',
      unknown:'Unbekannt', notProvided:'Nicht angegeben', noDates:'Keine Daten in diesem Zeitraum', unknownArtist:'Unbekannter Künstler', unknownAlbum:'Unbekanntes Album',
      showFor:'Daten für', rawDay:'Originaldaten ansehen', clearDay:'Tag zurücksetzen ×',
      activity:'Höraktivität', activitySub:'Gemeldete Hörzeit an aufgezeichneten Tagen', lastRecorded:'LETZTE {count} HÖRTAGE',
      playbackNotProvided:'keine Hörzeit angegeben', durationPlayback:'{time} Hörzeit', exploreBar:'anklicken, um diesen Tag anzusehen',
      chartFoot:'Basierend auf dem Tageswert playbackMs', howCalculated:'Wie wird das berechnet? ↗',
      topArtists:'Top-Künstler', topArtistsSub:'Die Künstler, die ich immer wieder höre', byPlays:'NACH WIEDERGABEN', itemTimeSuffix:'Eintragsdauer',
      noArtists:'Keine Künstler in diesem Zeitraum.', exploreArtists:'Alle Künstler ansehen',
      knownItemTooltip:'{ms} bekannte Eintragsdauer; {entries} mit unbekannter Dauer ausgeschlossen.', detailsFor:'Details zu {name}',
      recentTitle:'Zuletzt gehört', recentSub:'Meine letzten Tage mit Musik', historyBadge:'VERLAUF', unknownPlays:'Wiedergaben unbekannt', playbackNoun:'Hörzeit',
      noDays:'Keine Tage in diesem Zeitraum.', viewHistory:'Hörverlauf ansehen',
      heroEyebrow:'EIN KLEINER EINBLICK VON MAX', heroTitle:'Ein Blick auf <em>meine Musik.</em>',
      heroCopy:'Hey, ich bin Max. Hier findest du die Songs, Künstler und Alben, die ich auf Spotify gehört habe.', dateRange:'ZEITRAUM',
      disclaimer:'Die Hörstatistiken sind nicht live und enthalten möglicherweise nicht die neuesten Wiedergaben.', statsAria:'Zusammenfassung des Hörverlaufs',
      totalPlayback:'GESAMTE HÖRZEIT', totalPlays:'WIEDERGABEN', uniqueItems:'EINZIGARTIGE INHALTE', uniqueArtists:'KÜNSTLER',
      dailyPlayback:'tägliche Hörzeit', unknownCount:'{count} unbekannt', knownCountsOnly:'nur bekannte Angaben', sumTrackCounts:'Summe der Titelwiedergaben',
      tracksEpisodes:'Titel & Folgen', differentTracks:'verschiedene Titel', differentArtists:'verschiedene Künstler',
      knownPlaybackTitle:'{ms} ms bekannte Hörzeit', unknownDaysTitle:'; {count} Tage unbekannt', unknownCountsTitle:'Bei {count} Einträgen ist die Anzahl unbekannt', sumTrackCountsTitle:'Summe der count-Werte in den Titeln',
      topTracks:'Meine Top-Titel', topTracksSub:'Titel und Folgen, die ich am häufigsten höre', viewAll:'Alle anzeigen',
      track:'TITEL', album:'ALBUM', plays:'WIEDERGABEN', itemTime:'EINTRAGSDAUER', noTracks:'Keine Titel in diesem Zeitraum.', seeAllTracks:'Alle Titel ansehen',
      footer:'Von Max – für Freunde, die Musik lieben.', libraryEyebrow:'MAX’ HÖRMEDIATHEK',
      tracksTitle:'Titel & Folgen', tracksDesc:'Eine Sammlung der Titel und Folgen, die ich gehört habe. Wähle einen Eintrag für mehr Details.',
      artistsTitle:'Meine Künstler', artistsDesc:'Die Künstler hinter meinem Hörverlauf, nach ihren Original-IDs gruppiert.',
      albumsTitle:'Alben & Shows', albumsDesc:'Ein Blick auf die Alben und Shows in meiner Sammlung.',
      historyTitle:'Hörverlauf', historyDesc:'Entdecke Tag für Tag, was ich gehört habe.',
      uniqueItemsCount:'einzigartige Inhalte', artistsCount:'Künstler', albumsCount:'Alben & Shows', recordedDaysCount:'aufgezeichnete Tage',
      searchHistory:'Datum, Titel oder Künstler suchen…', searchArtists:'Künstler oder Spotify-URI suchen…', searchAlbums:'Album, Künstler oder URI suchen…', searchTracks:'Titel, Künstler, Album oder URI suchen…',
      searchLabel:'Suchen', sortBy:'Sortieren nach', sortAria:'Ergebnisse sortieren', newest:'Neueste zuerst', oldest:'Älteste zuerst', playbackTime:'Hörzeit', mostPlays:'Meiste Wiedergaben', itemTimeSort:'Eintragsdauer', nameSort:'Name A–Z', recentSort:'Zuletzt erfasst',
      emptyHeading:'Hier gibt es noch nichts', emptySearch:'Versuche einen anderen Suchbegriff.', emptySelection:'Für diese Auswahl gibt es keine Einträge.',
      date:'DATUM', playback:'HÖRZEIT', tracks:'TITEL', artists:'KÜNSTLER', albums:'ALBEN', trackEpisode:'TITEL / FOLGE', albumShow:'ALBUM / SHOW', artist:'KÜNSTLER', lastLogged:'ZULETZT ERFASST',
      rawDayAria:'Originaldaten für {date} ansehen', swipe:'Seitlich wischen, um alle Spalten zu sehen →', showing:'{start}–{end} von {total}', previousPage:'Vorherige Seite', nextPage:'Nächste Seite',
      historyMetric:'Die Hörzeit entspricht dem täglichen Originalwert <code>playbackMs</code>. * kennzeichnet eine unvollständige Summe, wenn Werte unbekannt sind. Wähle ein Datum für weitere Details.',
      itemMetric:'Wähle einen Eintrag für Millisekunden, URI und Originalwerte nach Datum. Die Eintragsdauer stammt aus dem Feld <code>ms</code> und kann von der Hörzeit abweichen. * kennzeichnet eine unvollständige Summe.', learnMore:'Mehr erfahren',
      closeDetails:'Details schließen', categoryTrack:'TITEL / FOLGE', categoryArtist:'KÜNSTLER', categoryAlbum:'ALBUM / SHOW', uriMissing:'Nicht vorhanden (siehe JSON-Schlüssel)',
      negativeDurationOne:' {entries} hatte eine negative oder fehlende Dauer und wurde aus der bekannten Gesamtdauer ausgeschlossen.', negativeDurationMany:' {entries} hatten eine negative oder fehlende Dauer und wurden aus der bekannten Gesamtdauer ausgeschlossen.',
      negativeCountOne:' {entries} hatte eine negative oder fehlende Wiedergabeanzahl und wurde aus der bekannten Summe ausgeschlossen.', negativeCountMany:' {entries} hatten eine negative oder fehlende Wiedergabeanzahl und wurden aus der bekannten Summe ausgeschlossen.',
      itemDetails:'Details zum Eintrag', knownItemTime:'BEKANNTE EINTRAGSDAUER', recordedDays:'AUFGEZEICHNETE TAGE', originalMetadata:'Originalkennungen & Metadaten', jsonKey:'JSON-Schlüssel', uriField:'URI-Feld',
      artistLabel:'Künstler', albumShowLabel:'Album / Show', imageUrl:'Bild-URL', knownItemMs:'Bekannte Eintragsdauer in ms',
      metadataHint:'Die Metadaten oben stammen vom neuesten Eintrag. Darunter stehen die exakten Originalwerte für jeden Tag.', byDate:'Nach Datum', originalMs:'ORIGINAL-MS',
      rawJson:'Original-JSON für jeden Tag ansehen', openSpotify:'In Spotify öffnen', close:'Schließen',
      dailyHistory:'TÄGLICHER HÖRVERLAUF', dayDetailCopy:'Eine vollständige Ansicht der Originaldaten dieses Tages.', reportedPlayback:'GEMELDETE HÖRZEIT', trackPlays:'TITELWIEDERGABEN', items:'EINTRÄGE', dateKey:'Datumsschlüssel', artistsLabel:'Künstler', albumsShows:'Alben / Shows', rawDayJson:'Original-JSON für diesen Tag', exploreDay:'Diesen Tag ansehen',
      understanding:'DIE DATEN VERSTEHEN', numbersTitle:'Was bedeuten die Zahlen?', gotIt:'Verstanden',
      explainHtml:'<p><strong>Hörzeit</strong> ist die Summe der täglichen <code>playbackMs</code>-Werte. Eine gemeldete Null bleibt Null, auch wenn an diesem Tag Titel aufgezeichnet wurden.</p><p><strong>Wiedergaben</strong> sind die Summe der <code>count</code>-Werte für Titel und Folgen. Titel, Künstler und Alben werden nach ihren ursprünglichen JSON-Schlüsseln gruppiert, nicht nur nach Namen.</p><p><strong>Eintragsdauer</strong> ist die Summe der <code>ms</code>-Werte eines Eintrags. Sie kann von der Hörzeit abweichen und wird nicht als Ersatz dafür verwendet.</p><p>Negative oder fehlende Millisekunden gelten als unbekannt und werden aus bekannten Summen ausgeschlossen. Öffne einen Eintrag oder Tag, um die genauen Originalwerte und das JSON anzusehen.</p><p>„Letzte 7 Tage“ und „Letzte 30 Tage“ beziehen sich auf Kalendertage rückwärts ab dem neuesten Datum in Max’ Datei.</p>',
      invalidFile:'Die veröffentlichte data.json ist ungültig. Stattdessen wird die in der Seite eingebettete Kopie angezeigt.',
      loadingTitle:'Dein Hörarchiv wird geladen…', loadingSubtitle:'Musik, Statistiken und Hörverlauf werden vorbereitet.',
      invalidRoot:'Erwartet wird ein JSON-Objekt mit Datumsangaben als Schlüssel, zum Beispiel "2026-08-03".', missingDates:'Keine gültigen Datumsangaben gefunden. Verwende YYYY-MM-DD als Schlüssel auf oberster Ebene.',
      invalidDay:'{date} muss ein Tagesobjekt enthalten.', invalidCollection:'{date}.{type} muss ein Objekt mit Eintrags-IDs oder URIs als Schlüssel sein.', invalidEntry:'{date}.{type}[{key}] muss ein Objekt sein.',
      ignoredOne:'{count} Schlüssel auf oberster Ebene ist kein gültiges Datum und wird nicht angezeigt.', ignoredMany:'{count} Schlüssel auf oberster Ebene sind keine gültigen Datumsangaben und werden nicht angezeigt.'
    }
  };
  function tr(key, values={}) {
    const template = messages[state.lang][key] ?? messages.en[key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
  }
  function trh(key, values={}) { return esc(tr(key,values)); }
  function locale() { return state.lang==='de' ? 'de-DE' : 'en-US'; }
  const PER_PAGE = 10;
  const navItems = [ ['overview','navOverview'],['tracks','navTracks'],['artists','navArtists'],['albums','navAlbums'],['history','navHistory'] ];
  const titles = {overview:'OVERVIEW',tracks:'TRACKS',artists:'ARTISTS',albums:'ALBUMS',history:'DAILY HISTORY'};
  const num = value => new Intl.NumberFormat(locale(), {maximumFractionDigits:2}).format(value || 0);
  const isObj = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const rawNumber = value => typeof value === 'number' && Number.isFinite(value) ? value : null;
  const positiveNumber = value => { const n=rawNumber(value); return n !== null && n >= 0 ? n : null; };
  function esc(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  const decodeCache = new Map();
  function text(value) {
    const s = String(value ?? '');
    if (!s.includes('&')) return s;
    if (decodeCache.has(s)) return decodeCache.get(s);
    const area = document.createElement('textarea');
    // Escape literal < before decoding entities; the result is escaped again on insertion.
    area.innerHTML = s.replace(/</g,'&lt;');
    const decoded = area.value;
    if (decodeCache.size < 3000) decodeCache.set(s, decoded);
    return decoded;
  }
  function shown(value, fallback='—') { return value === undefined || value === null || value === '' ? fallback : text(value); }
  function dateObj(key) { return new Date(`${key}T00:00:00Z`); }
  function validDate(key) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
    const d=dateObj(key);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0,10) === key;
  }
  function fmtDate(key, opts={month:'short',day:'numeric',year:'numeric'}) {
    return new Intl.DateTimeFormat(locale(),{...opts,timeZone:'UTC'}).format(dateObj(key));
  }
  function fmtLongDate(key) { return fmtDate(key,{weekday:'long',month:'long',day:'numeric',year:'numeric'}); }
  function fmtRange(days) {
    if (!days.length) return tr('noDates');
    const a=days[0].date,b=days[days.length-1].date;
    if (a===b) return fmtDate(a);
    const first=a.slice(0,4)===b.slice(0,4) ? fmtDate(a,{month:'short',day:'numeric'}) : fmtDate(a);
    return `${first} – ${fmtDate(b)}`;
  }
  // Use the supplied milliseconds, rather than inferring playback from track durations.
  function timeText(value, short=false) {
    const ms=positiveNumber(value);
    if (ms === null) return tr('unknown');
    if (ms>0 && ms<1000) return '<1s';
    let s=Math.floor(ms/1000), d=Math.floor(s/86400); s%=86400;
    const h=Math.floor(s/3600); s%=3600;
    const m=Math.floor(s/60), sec=s%60;
    if(d) { const dayUnit=state.lang==='de'?'T':'d'; return short ? `${d}${dayUnit} ${h}h` : `${d}${dayUnit} ${h}h ${m}m`; }
    if(h) return short ? `${h}h ${m}m` : `${h}h ${m}m ${sec}s`;
    if(m) return short ? `${m}m ${sec}s` : `${m}m ${sec}s`;
    return `${sec}s`;
  }
  function axisTime(value) {
    if (!value) return '0';
    if (value < 60000) return `${Math.round(value/1000)}s`;
    if (value < 3600000) return `${Math.round(value/60000)}m`;
    const h=value/3600000; return `${new Intl.NumberFormat(locale(),{maximumFractionDigits:1}).format(h)}h`;
  }
  function exactMs(value) {
    const n=rawNumber(value);
    if (n===null) return tr('notProvided');
    return `${new Intl.NumberFormat(locale(),{maximumFractionDigits:20}).format(n)} ms`;
  }
  function plural(n, word) {
    const forms={
      en:{play:['play','plays'],entry:['entry','entries'],'recorded day':['recorded day','recorded days']},
      de:{play:['Wiedergabe','Wiedergaben'],entry:['Eintrag','Einträge'],'recorded day':['aufgezeichneter Tag','aufgezeichnete Tage']}
    };
    const pair=forms[state.lang][word] || [word,`${word}s`];
    return `${num(n)} ${pair[n===1?0:1]}`;
  }
  function validate(data) {
    if (!isObj(data)) throw new Error(tr('invalidRoot'));
    const keys=Object.keys(data), dates=keys.filter(validDate).sort();
    if (!dates.length) throw new Error(tr('missingDates'));
    for (const date of dates) {
      const day=data[date];
      if (!isObj(day)) throw new Error(tr('invalidDay',{date}));
      for (const type of ['tracks','artists','albums']) {
        if (day[type] === undefined || day[type] === null) continue;
        if (!isObj(day[type])) throw new Error(tr('invalidCollection',{date,type}));
        for (const [key, entry] of Object.entries(day[type])) {
          if (!isObj(entry)) throw new Error(tr('invalidEntry',{date,type,key}));
        }
      }
    }
    const ignored=keys.length-dates.length;
    return ignored ? [tr(ignored===1?'ignoredOne':'ignoredMany',{count:num(ignored)})] : [];
  }
  function getDays() {
    let dates=Object.keys(state.data).filter(validDate).sort();
    if (state.selectedDate) dates=dates.filter(date => date===state.selectedDate);
    else if (dates.length && state.range!=='all') {
      const latest=dates[dates.length-1];
      if (state.range==='month') dates=dates.filter(d => d.slice(0,7)===latest.slice(0,7));
      else {
        const max=dateObj(latest).getTime();
        const min=max-(Number(state.range)-1)*86400000;
        dates=dates.filter(d => dateObj(d).getTime()>=min);
      }
    }
    return dates.map(date=>({date, raw:state.data[date]}));
  }
  function aggregate(type,days) {
    const map=new Map();
    for (const {date,raw:day} of days) {
      for (const [key,raw] of Object.entries(isObj(day[type]) ? day[type] : {})) {
        if (!isObj(raw)) continue;
        let item=map.get(key);
        if (!item) {
          item={key,type,name:'',artist:'',album:'',imageUrl:'',uri:undefined,count:0,countKnown:0,unknownCounts:0,ms:0,knownMs:0,unknownMs:0,occurrences:[],latest:raw,lastDate:date};
          map.set(key,item);
        }
        for (const field of ['name','artist','album','imageUrl']) {
          if (raw[field] !== undefined && raw[field] !== null && String(raw[field])!=='') item[field]=raw[field];
        }
        if (Object.prototype.hasOwnProperty.call(raw,'uri')) item.uri=raw.uri;
        const count=positiveNumber(raw.count), ms=positiveNumber(raw.ms);
        if (count===null) item.unknownCounts++; else {item.count+=count;item.countKnown++;}
        if (ms===null) item.unknownMs++; else {item.ms+=ms;item.knownMs++;}
        item.occurrences.push({date,raw}); item.latest=raw; item.lastDate=date;
      }
    }
    return Array.from(map.values());
  }
  function calc() {
    const days=getDays(), tracks=aggregate('tracks',days), artists=aggregate('artists',days), albums=aggregate('albums',days);
    const goodPlayback=days.map(d=>positiveNumber(d.raw.playbackMs));
    return {days,tracks,artists,albums,playback:goodPlayback.reduce((s,v)=>s+(v===null?0:v),0),playbackKnown:goodPlayback.filter(v=>v!==null).length,playbackUnknown:goodPlayback.filter(v=>v===null).length,plays:tracks.reduce((s,x)=>s+x.count,0),playsKnown:tracks.reduce((s,x)=>s+x.countKnown,0),playsUnknown:tracks.reduce((s,x)=>s+x.unknownCounts,0)};
  }
  function timeForItem(item, short=false) { return item.knownMs ? timeText(item.ms,short) : tr('unknown'); }
  function countForItem(item) { return item.countKnown ? num(item.count)+(item.unknownCounts?'*':'') : tr('unknown'); }
  function imageSrc(raw) {
    if (typeof raw!=='string') return '';
    let value=raw.trim();
    const md=value.match(/^\[[^\]]*\]\(((?:https?:\/\/|spotify:image:)[^)]+)\)$/i);
    if (md) value=md[1];
    const spot=value.match(/^spotify:image:([a-z0-9]+)$/i);
    if (spot) return coverCache[spot[1]] || `https://i.scdn.co/image/${spot[1]}`;
    const scdn=value.match(/^https?:\/\/i\.scdn\.co\/image\/([a-z0-9]+)(?:\?.*)?$/i);
    if (scdn && coverCache[scdn[1]]) return coverCache[scdn[1]];
    if (/^https?:\/\//i.test(value)) return value;
    if (/^data:image\/(png|jpeg|webp|gif);base64,/i.test(value)) return value;
    return '';
  }
  function art(raw, extra='') {
    const src=imageSrc(raw);
    return `<span class="art ${extra}">${icon('tracks',20)}${src?`<img src="${esc(src)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`:''}</span>`;
  }
  function spotifyLink(item) {
    const raw = typeof item.uri==='string' && item.uri ? item.uri : item.key;
    if (typeof raw!=='string') return '';
    const uri=raw.match(/^spotify:(track|artist|album|episode|show):([A-Za-z0-9]+)$/);
    if (uri) return `https://open.spotify.com/${uri[1]}/${uri[2]}`;
    if (/^https:\/\/open\.spotify\.com\/(track|artist|album|episode|show)\/[A-Za-z0-9]+(?:\?.*)?$/.test(raw)) return raw;
    return '';
  }
  function byPlays(a,b) { return b.count-a.count || b.ms-a.ms || text(a.name).localeCompare(text(b.name)); }
  function sorted(items,sort) {
    const a=items.slice();
    if (sort==='time') a.sort((x,y)=>(y.knownMs?y.ms:-1)-(x.knownMs?x.ms:-1) || byPlays(x,y));
    else if (sort==='name') a.sort((x,y)=>text(x.name||x.key).localeCompare(text(y.name||y.key),locale(),{sensitivity:'base'}) || byPlays(x,y));
    else if (sort==='recent') a.sort((x,y)=>y.lastDate.localeCompare(x.lastDate)||byPlays(x,y));
    else a.sort(byPlays);
    return a;
  }
  function navigate(view) {
    if (!titles[view]) return;
    state.view=view;state.query='';state.page=1;state.sort=view==='history'?'recent':'plays';
    render(); window.scrollTo({top:0,behavior:'smooth'});
  }
  function warningBanner() {
    return state.warnings.length ? `<div class="warning-banner">${icon('info',16)}<p style="margin:0">${esc(state.warnings.join(' '))}</p></div>` : '';
  }
  function scopeBanner() {
    if (!state.selectedDate) return '';
    return `<div class="scope-banner">${icon('calendar',16)}<span>${trh('showFor')} <strong>${esc(fmtLongDate(state.selectedDate))}</strong></span><span class="scope-buttons"><button type="button" class="text-link" data-action="open-day" data-date="${esc(state.selectedDate)}">${trh('rawDay')}</button><button type="button" class="text-link" data-action="clear-day">${trh('clearDay')}</button></span></div>`;
  }
  function statCard(label,value,sub,iconName,primary=false,title='') {
    return `<article class="stat-card${primary?' primary':''}"${title?` title="${esc(title)}"`:''}><div class="stat-head"><span class="stat-label">${esc(label)}</span><span class="stat-icon">${icon(iconName,16)}</span></div><div class="stat-number">${esc(value)}</div><div class="stat-caption">${esc(sub)}</div></article>`;
  }
  function niceMax(max) {
    if (!max) return 60000;
    const magnitude=Math.pow(10,Math.floor(Math.log10(max/3)));
    const step=Math.ceil((max/3)/magnitude)*magnitude;
    return step*3;
  }
  function activityChart(d) {
    const days=d.days.slice(-14), max=Math.max(0,...days.map(x=>positiveNumber(x.raw.playbackMs)||0)), domain=niceMax(max);
    const ticks=[domain,domain*2/3,domain/3,0];
    const bars=days.map((day,i)=>{
      const ms=positiveNumber(day.raw.playbackMs), height=ms===null?0:Math.max(0,100*ms/domain);
      let show=days.length<=8 || i%2===0 || i===days.length-1;
      if (days.length>8 && i===days.length-2) show=false;
      const label=fmtDate(day.date,{month:'short',day:'numeric'});
      const duration=ms===null?tr('playbackNotProvided'):tr('durationPlayback',{time:timeText(ms)});
      const title=`${fmtDate(day.date)}: ${duration}; ${tr('exploreBar')}`;
      return `<button type="button" class="bar-group${i===days.length-1?' latest':''}" data-action="select-day" data-date="${esc(day.date)}" title="${esc(title)}" aria-label="${esc(title)}"><span class="bar-surface"><span class="bar${ms===null?' unknown':''}" style="height:${Math.min(height,100).toFixed(2)}%"></span></span><span class="bar-label${show?'':' empty'}">${esc(label)}</span></button>`;
    }).join('');
    const recent=state.lang==='de' && days.length===1 ? 'LETZTER HÖRTAG' : tr('lastRecorded',{count:num(days.length)});
    return `<section class="card chart-card"><div class="card-header"><div><h2 class="card-title">${trh('activity')}</h2><p class="card-subtitle">${trh('activitySub')}</p></div><span class="mini-pill"><i class="live-dot"></i> ${esc(recent)}</span></div><div class="chart-wrap"><div class="y-labels">${ticks.map(t=>`<span>${esc(axisTime(t))}</span>`).join('')}</div><div class="plot-box"><div class="gridlines"><i></i><i></i><i></i><i></i></div><div class="chart-bars">${bars}</div></div></div><div class="chart-foot"><span>${trh('chartFoot')}</span><button type="button" data-action="explain">${trh('howCalculated')}</button></div></section>`;
  }
  function topArtists(d) {
    const artists=sorted(d.artists,'plays').slice(0,4);
    return `<section class="card"><div class="card-header"><div><h2 class="card-title">${trh('topArtists')}</h2><p class="card-subtitle">${trh('topArtistsSub')}</p></div><span class="mini-pill">${trh('byPlays')}</span></div><div class="artist-list">${artists.length?artists.map((it,i)=>`<button type="button" class="artist-entry" data-action="open-item" data-type="artists" data-key="${esc(it.key)}"><span class="artist-rank">${String(i+1).padStart(2,'0')}</span>${art(it.imageUrl)}<span class="artist-info"><span class="artist-name">${esc(shown(it.name,it.key))}</span><span class="artist-sub">${esc(timeForItem(it,true))} ${trh('itemTimeSuffix')}</span></span><span class="artist-count">${esc(it.countKnown?plural(it.count,'play'):tr('unknown'))}</span></button>`).join(''):`<p class="card-subtitle">${trh('noArtists')}</p>`}</div><div class="card-bottom"><button type="button" class="arrow-link" data-action="navigate" data-view="artists">${trh('exploreArtists')} ${icon('arrow',13)}</button></div></section>`;
  }
  function trackRow(it,index,compact=false) {
    const title=shown(it.name,it.key), artist=shown(it.artist,tr('unknownArtist')), album=shown(it.album,tr('unknownAlbum'));
    const tip=it.unknownMs?tr('knownItemTooltip',{ms:exactMs(it.ms),entries:plural(it.unknownMs,'entry')}):exactMs(it.ms);
    return `<tr><td class="rank-cell">${String(index+1).padStart(2,'0')}</td><td class="title-cell"><button type="button" class="title-button" data-action="open-item" data-type="tracks" data-key="${esc(it.key)}">${art(it.imageUrl)}<span class="title-meta"><span class="table-title" title="${esc(title)}">${esc(title)}</span><span class="table-sub">${esc(artist)}</span></span></button></td><td class="album-cell" title="${esc(album)}">${esc(album)}</td><td class="numeric number-cell">${esc(countForItem(it))}</td><td class="numeric number-cell" title="${esc(tip)}">${esc(timeForItem(it,true))}${it.unknownMs&&it.knownMs?'*':''}</td>${compact?'':`<td class="numeric"><button type="button" class="icon-btn table-chevron" data-action="open-item" data-type="tracks" data-key="${esc(it.key)}" aria-label="${trh('detailsFor',{name:title})}">${icon('right',16)}</button></td>`}</tr>`;
  }
  function recentDays(d) {
    const days=d.days.slice(-4).reverse();
    return `<section class="card"><div class="card-header"><div><h2 class="card-title">${trh('recentTitle')}</h2><p class="card-subtitle">${trh('recentSub')}</p></div><span class="mini-pill">${trh('historyBadge')}</span></div><div class="day-list">${days.map(({date,raw})=>{
      const dayCount=dayStats(raw), day=date.slice(-2), month=fmtDate(date,{month:'short'});
      const plays=dayCount.playsKnown ? plural(dayCount.plays,'play')+(dayCount.playsUnknown?'*':'') : tr('unknownPlays');
      return `<button type="button" class="day-entry" data-action="select-day" data-date="${esc(date)}"><span class="date-tile"><b>${esc(day)}</b><small>${esc(month)}</small></span><span class="day-meta"><strong class="day-link">${esc(fmtDate(date,{weekday:'long',month:'short',day:'numeric'}))}</strong><small>${esc(plays)} · ${esc(timeText(raw.playbackMs))} ${trh('playbackNoun')}</small></span><span class="day-arrow">${icon('right',15)}</span></button>`;
    }).join('') || `<p class="card-subtitle">${trh('noDays')}</p>`}</div><div class="card-bottom"><button type="button" class="arrow-link" data-action="navigate" data-view="history">${trh('viewHistory')} ${icon('arrow',13)}</button></div></section>`;
  }
  function overview(d) {
    const top=sorted(d.tracks,'plays').slice(0,5);
    const playbackLabel=d.playbackKnown?timeText(d.playback,true):tr('unknown');
    const tracksExtra=d.tracks.some(x=>/^spotify:(episode|media):/.test(x.key))?tr('tracksEpisodes'):tr('differentTracks');
    const playCount=d.playsKnown || !d.tracks.length ? num(d.plays)+(d.playsUnknown?'*':'') : tr('unknown');
    const playbackCaption=`${plural(d.days.length,'recorded day')} · ${d.playbackUnknown ? tr('unknownCount',{count:num(d.playbackUnknown)}) : tr('dailyPlayback')}`;
    const playbackTip=tr('knownPlaybackTitle',{ms:num(d.playback)})+(d.playbackUnknown?tr('unknownDaysTitle',{count:num(d.playbackUnknown)}):'');
    const playsTip=d.playsUnknown?tr('unknownCountsTitle',{count:num(d.playsUnknown)}):tr('sumTrackCountsTitle');
    return `<section class="intro"><div><div class="eyebrow"><span class="tiny-spark">✳</span> ${trh('heroEyebrow')}</div><h1>${tr('heroTitle')}</h1><p>${trh('heroCopy')}</p></div><div class="period-box"><span class="period-icon">${icon('calendar',18)}</span><span class="period-text"><small>${trh('dateRange')}</small><strong>${esc(fmtRange(d.days))}</strong><span class="period-disclaimer">${trh('disclaimer')}</span></span></div></section>
      ${warningBanner()}${scopeBanner()}
      <section class="stats-grid" aria-label="${trh('statsAria')}">
        ${statCard(tr('totalPlayback'),playbackLabel,playbackCaption,'clock',true,playbackTip)}
        ${statCard(tr('totalPlays'),playCount,d.playsUnknown?tr('knownCountsOnly'):tr('sumTrackCounts'),'play',false,playsTip)}
        ${statCard(tr('uniqueItems'),num(d.tracks.length),tracksExtra,'tracks')}
        ${statCard(tr('uniqueArtists'),num(d.artists.length),tr('differentArtists'),'artists')}
      </section>
      <div class="dashboard-row">${activityChart(d)}${topArtists(d)}</div>
      <div class="dashboard-row lower-row"><section class="card"><div class="card-header"><div><h2 class="card-title">${trh('topTracks')}</h2><p class="card-subtitle">${trh('topTracksSub')}</p></div><button type="button" class="arrow-link" data-action="navigate" data-view="tracks">${trh('viewAll')} ${icon('arrow',13)}</button></div><div class="table-compact-wrap table-scroll"><table class="music-table compact-table"><thead><tr><th class="rank-cell">#</th><th>${trh('track')}</th><th>${trh('album')}</th><th class="numeric">${trh('plays')}</th><th class="numeric">${trh('itemTime')}</th></tr></thead><tbody>${top.length?top.map((it,i)=>trackRow(it,i,true)).join(''):`<tr><td colspan="5">${trh('noTracks')}</td></tr>`}</tbody></table></div><div class="card-bottom"><button type="button" class="arrow-link" data-action="navigate" data-view="tracks">${trh('seeAllTracks')} ${icon('arrow',13)}</button></div></section>${recentDays(d)}</div>
      <div class="footnote">${icon('tracks',13)} ${trh('footer')}</div>`;
  }
  function listHead(view,d) {
    const meta={tracks:['tracksTitle','tracksDesc'],artists:['artistsTitle','artistsDesc'],albums:['albumsTitle','albumsDesc'],history:['historyTitle','historyDesc']}[view];
    const count=view==='history'?d.days.length:d[view].length;
    const noun={tracks:'uniqueItemsCount',artists:'artistsCount',albums:'albumsCount',history:'recordedDaysCount'}[view];
    const countLabel=view==='history'?plural(count,'recorded day'):`${num(count)} ${tr(noun)}`;
    return `<div class="view-header"><div class="eyebrow"><span class="tiny-spark">✳</span> ${trh('libraryEyebrow')}</div><h1>${trh(meta[0])}</h1><p>${trh(meta[1])} <strong class="view-count">${esc(countLabel)}.</strong></p></div>${warningBanner()}${scopeBanner()}`;
  }
  function viewTools(view) {
    const placeholder=tr(view==='history'?'searchHistory':view==='artists'?'searchArtists':view==='albums'?'searchAlbums':'searchTracks');
    const options=view==='history' ? [['recent','newest'],['oldest','oldest'],['playback','playbackTime'],['plays','mostPlays']] : [['plays','mostPlays'],['time','itemTimeSort'],['name','nameSort'],['recent','recentSort']];
    return `<div class="view-tools"><div class="view-tools-left"><label class="search-wrap">${icon('search',16)}<span class="sr-only">${trh('searchLabel')}</span><input id="search-input" type="search" placeholder="${esc(placeholder)}" value="${esc(state.query)}" autocomplete="off"></label></div><div class="sort-wrap"><span>${trh('sortBy')}</span><div class="sort-control"><select id="sort-select" aria-label="${trh('sortAria')}">${options.map(([value,label])=>`<option value="${value}"${state.sort===value?' selected':''}>${trh(label)}</option>`).join('')}</select></div></div></div>`;
  }
  function dayStats(day) {
    const tracks=Object.values(isObj(day.tracks)?day.tracks:{}), artists=Object.keys(isObj(day.artists)?day.artists:{}), albums=Object.keys(isObj(day.albums)?day.albums:{});
    const counts=tracks.map(x=>positiveNumber(x.count));
    return {plays:counts.reduce((s,x)=>s+(x===null?0:x),0),playsKnown:!tracks.length || counts.some(x=>x!==null),playsUnknown:counts.filter(x=>x===null).length,tracks:tracks.length,artists:artists.length,albums:albums.length};
  }
  function historyMatches(day,q) {
    if (!q) return true;
    const hay=[day.date,fmtDate(day.date),fmtLongDate(day.date)];
    for (const section of ['tracks','artists','albums']) for (const [key,row] of Object.entries(isObj(day.raw[section])?day.raw[section]:{})) hay.push(key,row.name||'',row.artist||'',row.album||'');
    return text(hay.join(' ')).toLocaleLowerCase(locale()).includes(q);
  }
  function listResults() {
    const d=state.derived, view=state.view, q=state.query.trim().toLocaleLowerCase(locale());
    let items;
    if(view==='history') {
      items=d.days.filter(x=>historyMatches(x,q));
      if(state.sort==='oldest') items.sort((a,b)=>a.date.localeCompare(b.date));
      else if(state.sort==='playback') items.sort((a,b)=>(positiveNumber(b.raw.playbackMs)??-1)-(positiveNumber(a.raw.playbackMs)??-1)||b.date.localeCompare(a.date));
      else if(state.sort==='plays') items.sort((a,b)=>dayStats(b.raw).plays-dayStats(a.raw).plays||b.date.localeCompare(a.date));
      else items.sort((a,b)=>b.date.localeCompare(a.date));
    } else {
      items=sorted(d[view].filter(it=>!q || text([it.name,it.artist,it.album,it.key,it.uri].filter(Boolean).join(' ')).toLocaleLowerCase(locale()).includes(q)),state.sort);
    }
    const total=items.length, pages=Math.max(1,Math.ceil(total/PER_PAGE));
    state.page=Math.max(1,Math.min(state.page,pages));
    const start=(state.page-1)*PER_PAGE, current=items.slice(start,start+PER_PAGE);
    if (!total) return `<div class="empty-state"><span class="empty-icon">${icon('search',22)}</span><strong>${trh('emptyHeading')}</strong><p>${trh(q?'emptySearch':'emptySelection')}</p></div>`;
    let header='',body='';
    if(view==='history') {
      header=`<tr><th>${trh('date')}</th><th class="numeric">${trh('playback')}</th><th class="numeric">${trh('plays')}</th><th class="numeric">${trh('tracks')}</th><th class="numeric">${trh('artists')}</th><th class="numeric">${trh('albums')}</th><th></th></tr>`;
      body=current.map(({date,raw})=>{const s=dayStats(raw);return `<tr><td><button type="button" class="history-date" data-action="select-day" data-date="${esc(date)}">${esc(fmtDate(date,{weekday:'long',month:'short',day:'numeric'}))}<small>${esc(date)}</small></button></td><td class="numeric number-cell" title="${esc(exactMs(raw.playbackMs))}">${esc(timeText(raw.playbackMs,true))}</td><td class="numeric number-cell">${s.playsKnown?num(s.plays)+(s.playsUnknown?'*':''):trh('unknown')}</td><td class="numeric">${num(s.tracks)}</td><td class="numeric">${num(s.artists)}</td><td class="numeric">${num(s.albums)}</td><td class="numeric"><button class="icon-btn" type="button" data-action="open-day" data-date="${esc(date)}" aria-label="${trh('rawDayAria',{date})}">${icon('info',16)}</button></td></tr>`;}).join('');
    } else if(view==='tracks') {
      header=`<tr><th class="rank-cell">#</th><th>${trh('trackEpisode')}</th><th>${trh('albumShow')}</th><th class="numeric">${trh('plays')}</th><th class="numeric">${trh('itemTime')}</th><th></th></tr>`;
      body=current.map((it,i)=>trackRow(it,start+i)).join('');
    } else {
      header=view==='artists'?`<tr><th class="rank-cell">#</th><th>${trh('artist')}</th><th class="numeric">${trh('plays')}</th><th class="numeric">${trh('itemTime')}</th><th>${trh('lastLogged')}</th><th></th></tr>`:`<tr><th class="rank-cell">#</th><th>${trh('albumShow')}</th><th>${trh('artist')}</th><th class="numeric">${trh('plays')}</th><th class="numeric">${trh('itemTime')}</th><th></th></tr>`;
      body=current.map((it,i)=>{
        const name=shown(it.name,it.key), artist=shown(it.artist,tr('unknownArtist')), last=fmtDate(it.lastDate,{month:'short',day:'numeric',year:'numeric'});
        return `<tr><td class="rank-cell">${String(start+i+1).padStart(2,'0')}</td><td class="title-cell"><button type="button" class="title-button" data-action="open-item" data-type="${view}" data-key="${esc(it.key)}">${art(it.imageUrl,view==='artists'?'round-art':'')}<span class="title-meta"><span class="table-title" title="${esc(name)}">${esc(name)}</span><span class="table-sub">${view==='artists'?esc(plural(it.occurrences.length,'recorded day')):esc(artist)}</span></span></button></td>${view==='albums'?`<td class="album-cell" title="${esc(artist)}">${esc(artist)}</td>`:''}<td class="numeric number-cell">${esc(countForItem(it))}</td><td class="numeric number-cell" title="${esc(exactMs(it.ms))}">${esc(timeForItem(it,true))}${it.unknownMs&&it.knownMs?'*':''}</td>${view==='artists'?`<td>${esc(last)}</td>`:''}<td class="numeric"><button type="button" class="icon-btn table-chevron" data-action="open-item" data-type="${view}" data-key="${esc(it.key)}" aria-label="${trh('detailsFor',{name})}">${icon('right',16)}</button></td></tr>`;
      }).join('');
    }
    const showing=tr('showing',{start:num(start+1),end:num(Math.min(start+PER_PAGE,total)),total:num(total)});
    return `<div class="mobile-scroll-note">${trh('swipe')}</div><div class="list-table-wrap table-scroll"><table class="music-table list-table"><thead>${header}</thead><tbody>${body}</tbody></table></div><div class="result-footer"><span>${esc(showing)}</span><div class="page-buttons"><button type="button" data-action="prev-page" aria-label="${trh('previousPage')}" ${state.page<=1?'disabled':''}>${icon('left',15)}</button><span class="page-current">${state.page} / ${pages}</span><button type="button" data-action="next-page" aria-label="${trh('nextPage')}" ${state.page>=pages?'disabled':''}>${icon('right',15)}</button></div></div>${view==='history'?`<div class="metric-note">${tr('historyMetric')}</div>`:`<div class="metric-note">${tr('itemMetric')} <button class="text-link" data-action="explain" type="button">${trh('learnMore')}</button></div>`}`;
  }
  function listView(view,d) { return `${listHead(view,d)}<section class="card">${viewTools(view)}<div id="list-results">${listResults()}</div></section><div class="footnote">${icon('tracks',13)} ${trh('footer')}</div>`; }
  function render() {
    state.derived=calc();
    $('sidebar-nav').innerHTML=navItems.map(([view,key])=>{const label=tr(key);return `<button class="nav-button${state.view===view?' active':''}" type="button" data-action="navigate" data-view="${view}" title="${esc(label)}" ${state.view===view?'aria-current="page"':''}>${icon(view,18)}<span>${esc(label)}</span></button>`;}).join('');
    $('range-select').value=state.range;
    syncDropdown($('range-select'));
    $('page-content').innerHTML=state.view==='overview'?overview(state.derived):listView(state.view,state.derived);
    if ($('sort-select')) enhanceDropdown($('sort-select'));
  }
  function showDialog(dialog) { if (!dialog.open) dialog.showModal(); }
  function closeDetail() { if ($('detail-dialog').open) $('detail-dialog').close(); }
  function itemDetail(type,key) {
    const item=state.derived[type]?.find(row=>row.key===key);
    if (!item) return;
    const title=shown(item.name,item.key), category=tr({tracks:'categoryTrack',artists:'categoryArtist',albums:'categoryAlbum'}[type]), link=spotifyLink(item);
    const latest=item.latest, ownUri=Object.prototype.hasOwnProperty.call(latest,'uri') ? (latest.uri===null?'null':shown(latest.uri,tr('notProvided'))) : tr('uriMissing');
    const rawEntries=Object.fromEntries(item.occurrences.slice().reverse().map(({date,raw})=>[date,{[item.key]:raw}]));
    const unknown=item.unknownMs?tr(item.unknownMs===1?'negativeDurationOne':'negativeDurationMany',{entries:plural(item.unknownMs,'entry')}):'';
    const unknownCount=item.unknownCounts?tr(item.unknownCounts===1?'negativeCountOne':'negativeCountMany',{entries:plural(item.unknownCounts,'entry')}):'';
    const rows=item.occurrences.slice().reverse().map(({date,raw})=>`<tr><td>${esc(fmtDate(date))}</td><td class="numeric">${positiveNumber(raw.count)===null?trh('unknown'):num(raw.count)}</td><td class="numeric">${esc(timeText(raw.ms,true))}</td><td class="numeric raw-value">${esc(exactMs(raw.ms))}</td></tr>`).join('');
    const rawImage=Object.prototype.hasOwnProperty.call(latest,'imageUrl') ? (latest.imageUrl===null?'null':shown(latest.imageUrl,tr('notProvided'))) : tr('notProvided');
    $('detail-content').innerHTML=`<div class="modal-head"><div class="modal-heading"><div class="eyebrow">${trh('libraryEyebrow')}</div><h2>${trh('itemDetails')}</h2></div><button class="icon-btn" type="button" data-action="close-detail" aria-label="${trh('closeDetails')}">${icon('close',19)}</button></div><div class="modal-body"><div class="detail-hero">${art(item.imageUrl,'detail-art')}<div class="detail-text"><div class="detail-type">${esc(category)}</div><h2>${esc(title)}</h2><p>${esc(type==='artists'?plural(item.occurrences.length,'recorded day'):shown(item.artist,tr('unknownArtist')))}${type==='tracks'?` · ${esc(shown(item.album,tr('unknownAlbum')))}`:''}</p></div></div><div class="detail-stats"><div class="detail-stat"><small>${trh('plays')}</small><strong>${esc(countForItem(item))}</strong></div><div class="detail-stat"><small>${trh('knownItemTime')}</small><strong>${esc(timeForItem(item))}</strong></div><div class="detail-stat"><small>${trh('recordedDays')}</small><strong>${num(item.occurrences.length)}</strong></div></div><div class="details-section"><h3>${trh('originalMetadata')}</h3><dl class="detail-grid"><dt>${trh('jsonKey')}</dt><dd><code>${esc(item.key)}</code></dd><dt>${trh('uriField')}</dt><dd><code>${esc(ownUri)}</code></dd>${type!=='artists'?`<dt>${trh('artistLabel')}</dt><dd>${esc(shown(latest.artist,tr('notProvided')))}</dd>`:''}${type==='tracks'?`<dt>${trh('albumShowLabel')}</dt><dd>${esc(shown(latest.album,tr('notProvided')))}</dd>`:''}<dt>${trh('imageUrl')}</dt><dd><code>${esc(rawImage)}</code></dd><dt>${trh('knownItemMs')}</dt><dd><code>${item.knownMs?esc(exactMs(item.ms)):trh('unknown')}</code></dd></dl><p class="detail-hint">${trh('metadataHint')}${esc(unknown)}${esc(unknownCount)}</p></div><div class="details-section"><h3>${trh('byDate')}</h3><div class="table-scroll"><table class="detail-table"><thead><tr><th>${trh('date')}</th><th class="numeric">${trh('plays')}</th><th class="numeric">${trh('itemTime')}</th><th class="numeric">${trh('originalMs')}</th></tr></thead><tbody>${rows}</tbody></table></div><details><summary>${trh('rawJson')}</summary><pre>${esc(JSON.stringify(rawEntries,null,2))}</pre></details></div><div class="detail-actions">${link?`<a class="button button-dark" href="${esc(link)}" target="_blank" rel="noopener noreferrer">${trh('openSpotify')} ${icon('external',14)}</a>`:''}<button type="button" class="button button-light" data-action="close-detail">${trh('close')}</button></div></div>`;
    showDialog($('detail-dialog'));
  }
  function dayDetail(date) {
    if(!validDate(date)||!isObj(state.data[date]))return;
    const day=state.data[date], s=dayStats(day);
    $('detail-content').innerHTML=`<div class="modal-head"><div class="modal-heading"><div class="eyebrow">${trh('dailyHistory')}</div><h2>${esc(fmtLongDate(date))}</h2><p class="modal-copy">${trh('dayDetailCopy')}</p></div><button type="button" class="icon-btn" data-action="close-detail" aria-label="${trh('closeDetails')}">${icon('close',19)}</button></div><div class="modal-body"><div class="detail-stats"><div class="detail-stat"><small>${trh('reportedPlayback')}</small><strong>${esc(timeText(day.playbackMs))}</strong></div><div class="detail-stat"><small>${trh('trackPlays')}</small><strong>${s.playsKnown?num(s.plays)+(s.playsUnknown?'*':''):trh('unknown')}</strong></div><div class="detail-stat"><small>${trh('items')}</small><strong>${num(s.tracks)}</strong></div></div><div class="details-section"><dl class="detail-grid"><dt>${trh('dateKey')}</dt><dd><code>${esc(date)}</code></dd><dt>playbackMs</dt><dd><code>${esc(exactMs(day.playbackMs))}</code></dd><dt>${trh('artistsLabel')}</dt><dd>${num(s.artists)}</dd><dt>${trh('albumsShows')}</dt><dd>${num(s.albums)}</dd></dl><details open><summary>${trh('rawDayJson')}</summary><pre>${esc(JSON.stringify({[date]:day},null,2))}</pre></details></div><div class="detail-actions"><button class="button button-dark" type="button" data-action="select-day" data-date="${esc(date)}">${trh('exploreDay')} ${icon('arrow',14)}</button><button class="button button-light" type="button" data-action="close-detail">${trh('close')}</button></div></div>`;
    showDialog($('detail-dialog'));
  }
  function explain() {
    $('detail-content').innerHTML=`<div class="modal-head"><div class="modal-badge">${icon('info',19)}</div><div class="modal-heading"><div class="eyebrow">${trh('understanding')}</div><h2>${trh('numbersTitle')}</h2></div><button type="button" class="icon-btn" data-action="close-detail" aria-label="${trh('closeDetails')}">${icon('close',19)}</button></div><div class="modal-body"><div class="details-section explain-copy">${tr('explainHtml')}</div><div class="detail-actions"><button type="button" class="button button-dark" data-action="close-detail">${trh('gotIt')}</button></div></div>`;
    showDialog($('detail-dialog'));
  }
  // The owner publishes data.json beside the page; the embedded copy is a fallback
  // for opening index.html directly or running in a network-restricted preview.
  async function readDataFile() {
    if (location.protocol === 'file:') return null;
    const response = await fetch('./data.json', {cache:'no-store'});
    if (!response.ok) return null;
    try {
      const data = await response.json();
      return {data, warnings:validate(data)};
    } catch (err) {
      const invalid = new Error(tr('invalidFile'));
      invalid.invalidData = true;
      throw invalid;
    }
  }
  function applyData(data, warnings=[]) {
    state.data=data;state.warnings=warnings;
    state.view='overview';state.range='all';state.selectedDate=null;state.query='';state.sort='plays';state.page=1;
    render();
  }

  function showInvalidDataTemplate() {
    const title=esc(tr('loadingTitle')), subtitle=esc(tr('loadingSubtitle'));
    const stats=Array.from({length:4},()=>'<article class="loading-stat-card"><span class="loading-skeleton loading-label"></span><span class="loading-skeleton loading-number"></span><span class="loading-skeleton loading-caption"></span></article>').join('');
    const bars=[34,52,39,64,47,73,58,83,61,92,68,77].map(height=>'<i class="loading-skeleton loading-bar" style="height:'+height+'%" aria-hidden="true"></i>').join('');
    const artists=Array.from({length:4},()=>'<div class="loading-artist"><span class="loading-skeleton loading-avatar"></span><span class="loading-artist-lines"><i class="loading-skeleton loading-artist-name"></i><i class="loading-skeleton loading-artist-meta"></i></span></div>').join('');
    const tracks=Array.from({length:5},()=>'<div class="loading-track"><span class="loading-skeleton loading-cover"></span><span class="loading-track-lines"><i class="loading-skeleton loading-track-name"></i><i class="loading-skeleton loading-track-meta"></i></span><span class="loading-skeleton loading-track-value"></span></div>').join('');
    const markup=[
      '<main class="loading-screen" role="status" aria-live="polite" aria-busy="true">',
      '<div class="loading-shell">',
      '<header class="loading-header">',
      '<div class="loading-brand"><span class="loading-brand-mark">♫</span><span>soundlog<span class="loading-brand-dot">.</span></span></div>',
      '<div class="loading-controls" aria-hidden="true"><span class="loading-skeleton loading-control"></span><span class="loading-skeleton loading-control"></span><span class="loading-skeleton loading-control"></span></div>',
      '</header>',
      '<section class="loading-content" aria-label="'+title+'">',
      '<p class="loading-kicker">'+subtitle+'</p>',
      '<h1 class="loading-title">'+title+'</h1>',
      '<div class="loading-stats" aria-hidden="true">'+stats+'</div>',
      '<div class="loading-panels">',
      '<section class="loading-panel" aria-hidden="true"><div class="loading-panel-head"><span class="loading-skeleton loading-heading"></span><span class="loading-skeleton loading-badge"></span></div><div class="loading-chart">'+bars+'</div></section>',
      '<section class="loading-panel" aria-hidden="true"><div class="loading-panel-head"><span class="loading-skeleton loading-heading"></span></div><div class="loading-artist-list">'+artists+'</div></section>',
      '</div>',
      '<section class="loading-panel loading-song-panel" aria-hidden="true"><div class="loading-panel-head"><span class="loading-skeleton loading-heading"></span><span class="loading-skeleton loading-badge"></span></div><div class="loading-track-list">'+tracks+'</div></section>',
      '</section></div></main>'
    ].join('');
    document.title=tr('loadingTitle');
    document.body.innerHTML=markup;
  }
  // Build a real button/listbox UI around each native select. The select remains
  // the single source of truth for existing filters, language and theme logic.
  function enhanceDropdown(select) {
    if (!select || select.dataset.customDropdown) return;
    const kind=select.id.replace(/-select$/,'');
    const host=select.parentElement;
    const trigger=document.createElement('button');
    const panel=document.createElement('div');
    const heading=document.createElement('div');
    const iconName={range:'calendar',theme:'system',language:'language',sort:'sort'}[kind] || 'down';
    const iconId=kind==='range'?'calendar-icon':`${kind}-icon`;
    trigger.type='button';trigger.id=`${kind}-trigger`;trigger.className='dropdown-trigger';
    trigger.setAttribute('aria-haspopup','listbox');
    trigger.setAttribute('aria-expanded','false');
    trigger.setAttribute('aria-controls',`${kind}-menu`);
    trigger.innerHTML=`<span id="${iconId}" class="dropdown-leading" aria-hidden="true">${icon(iconName,15)}</span><span class="dropdown-value"></span><span class="chevron dropdown-chevron" id="${kind}-chevron" aria-hidden="true">${icon('down',13)}</span>`;
    panel.id=`${kind}-menu`;panel.className='dropdown-menu';panel.setAttribute('role','listbox');panel.hidden=true;
    heading.className='dropdown-caption';heading.setAttribute('aria-hidden','true');panel.appendChild(heading);
    for(const source of select.options){
      const item=document.createElement('button');
      item.type='button';item.tabIndex=-1;item.className='dropdown-option';item.dataset.value=source.value;
      item.setAttribute('role','option');item.setAttribute('aria-selected','false');
      item.disabled=source.disabled;
      const glyph=document.createElement('span');glyph.className='dropdown-option-icon';glyph.setAttribute('aria-hidden','true');
      if(kind==='language'){
        glyph.classList.add('language-badge');glyph.textContent=source.value.toUpperCase();
      } else {
        const optionIcons={system:'system',light:'light',dark:'dark',recent:'history',oldest:'history',playback:'clock',time:'clock',plays:'play',name:'artists'};
        glyph.innerHTML=icon(optionIcons[source.value] || (kind==='range'?'calendar':'sort'),14);
      }
      const text=document.createElement('span');text.className='dropdown-option-text';
      const mark=document.createElement('span');mark.className='dropdown-check';mark.setAttribute('aria-hidden','true');mark.innerHTML=icon('check',15);
      item.append(glyph,text,mark);panel.appendChild(item);
    }
    host.classList.add('dropdown','is-custom');
    select.dataset.customDropdown=kind;
    select.hidden=true;
    host.append(trigger,panel);
    syncDropdown(select);
  }
  function syncDropdown(select) {
    if(!select || !select.dataset.customDropdown)return;
    const host=select.parentElement, trigger=host.querySelector('.dropdown-trigger'), panel=host.querySelector('.dropdown-menu');
    if(!trigger || !panel)return;
    const selected=select.options[select.selectedIndex];
    const label=select.getAttribute('aria-label') || '';
    trigger.querySelector('.dropdown-value').textContent=selected?.textContent || '';
    trigger.setAttribute('aria-label',`${label}: ${selected?.textContent || ''}`);
    panel.setAttribute('aria-label',label);
    const short=host.querySelector('.sr-only');
    panel.querySelector('.dropdown-caption').textContent=short?.textContent || label;
    const items=panel.querySelectorAll('.dropdown-option');
    Array.from(select.options).forEach((source,i)=>{
      const item=items[i];if(!item)return;
      item.querySelector('.dropdown-option-text').textContent=source.textContent;
      item.setAttribute('aria-selected',String(source.selected));
      item.disabled=source.disabled;
    });
  }
  function closeDropdown(host,restoreFocus=false) {
    if(!host)return;
    const trigger=host.querySelector('.dropdown-trigger'), panel=host.querySelector('.dropdown-menu');
    if(!trigger || !panel)return;
    panel.hidden=true;host.classList.remove('is-open','opens-up');trigger.setAttribute('aria-expanded','false');
    if(restoreFocus && trigger.isConnected)trigger.focus({preventScroll:true});
  }
  function closeOtherDropdowns(except=null) {
    document.querySelectorAll('.dropdown.is-open').forEach(host=>{if(host!==except)closeDropdown(host);});
  }
  function focusDropdownItem(item) {
    if(!item)return;
    item.focus({preventScroll:true});
    item.scrollIntoView({block:'nearest',inline:'nearest'});
  }
  function positionDropdown(host) {
    const panel=host.querySelector('.dropdown-menu');
    if(!panel || panel.hidden)return;
    // Choose the roomier side and scroll inside the menu on short viewports.
    host.classList.remove('opens-up');panel.style.maxHeight='';
    const menuRect=panel.getBoundingClientRect(), hostRect=host.getBoundingClientRect();
    const below=Math.max(0,window.innerHeight-hostRect.bottom-15),above=Math.max(0,hostRect.top-15);
    const upwards=menuRect.height>below && above>below;
    if(upwards)host.classList.add('opens-up');
    panel.style.maxHeight=`${Math.max(48,Math.min(menuRect.height,upwards?above:below))}px`;
  }
  function openDropdown(host) {
    const select=host.querySelector('select[data-custom-dropdown]'), trigger=host.querySelector('.dropdown-trigger'), panel=host.querySelector('.dropdown-menu');
    if(!select || !trigger || !panel)return;
    closeOtherDropdowns(host);syncDropdown(select);
    host.classList.add('is-open');panel.hidden=false;trigger.setAttribute('aria-expanded','true');
    positionDropdown(host);
    focusDropdownItem(panel.querySelector('[role="option"][aria-selected="true"]:not(:disabled)') || panel.querySelector('[role="option"]:not(:disabled)'));
  }
  function chooseDropdown(host,item) {
    const select=host.querySelector('select[data-custom-dropdown]');
    if(!select || !item || item.disabled)return;
    const changed=select.value!==item.dataset.value;
    select.value=item.dataset.value;
    closeDropdown(host,true);syncDropdown(select);
    if(changed)select.dispatchEvent(new Event('change',{bubbles:true}));
  }
  function setUpDropdownEvents() {
    window.addEventListener('resize',()=>document.querySelectorAll('.dropdown.is-open').forEach(positionDropdown));
    document.addEventListener('pointerdown',event=>{
      document.querySelectorAll('.dropdown.is-open').forEach(host=>{if(!host.contains(event.target))closeDropdown(host);});
    });
    document.addEventListener('focusin',event=>{
      document.querySelectorAll('.dropdown.is-open').forEach(host=>{if(!host.contains(event.target))closeDropdown(host);});
    });
    document.addEventListener('click',event=>{
      const trigger=event.target.closest('.dropdown-trigger');
      if(trigger){
        const host=trigger.closest('.dropdown');event.preventDefault();
        if(host.classList.contains('is-open'))closeDropdown(host,true);else openDropdown(host);
        return;
      }
      const item=event.target.closest('.dropdown-option');
      if(item){event.preventDefault();chooseDropdown(item.closest('.dropdown'),item);}
    });
    document.addEventListener('keydown',event=>{
      const host=event.target.closest('.dropdown.is-custom');
      if(!host)return;
      const trigger=host.querySelector('.dropdown-trigger'),panel=host.querySelector('.dropdown-menu');
      const onTrigger=event.target===trigger, onItem=event.target.matches('.dropdown-option');
      if(event.key==='Escape' && host.classList.contains('is-open')){
        event.preventDefault();event.stopPropagation();closeDropdown(host,true);return;
      }
      if(event.key==='Tab' && host.classList.contains('is-open')){
        closeDropdown(host,onItem);return;
      }
      if(onTrigger && ['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
        event.preventDefault();openDropdown(host);
        const choices=Array.from(panel.querySelectorAll('[role="option"]:not(:disabled)'));
        if(event.key==='Home')focusDropdownItem(choices[0]);
        if(event.key==='End')focusDropdownItem(choices[choices.length-1]);
        return;
      }
      if(!onItem)return;
      const choices=Array.from(panel.querySelectorAll('[role="option"]:not(:disabled)'));
      const current=choices.indexOf(event.target);
      if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
        event.preventDefault();
        const index=event.key==='Home'?0:event.key==='End'?choices.length-1:event.key==='ArrowDown'?Math.min(current+1,choices.length-1):Math.max(current-1,0);
        focusDropdownItem(choices[index]);
      } else if(event.key==='Enter' || event.key===' '){
        event.preventDefault();chooseDropdown(host,event.target);
      } else if(event.key.length===1 && /[\p{L}\p{N}]/u.test(event.key)){
        // Jump to an option by its first character, without changing selection.
        const key=event.key.toLocaleLowerCase(locale());
        const ordered=choices.slice(current+1).concat(choices.slice(0,current+1));
        const match=ordered.find(item=>item.querySelector('.dropdown-option-text').textContent.trim().toLocaleLowerCase(locale()).startsWith(key));
        if(match){event.preventDefault();focusDropdownItem(match);}
      }
    });
  }
  function setUpTheme() {
    const root=document.documentElement;
    const select=$('theme-select');
    const valid=['system','light','dark'];
    const media=typeof window.matchMedia==='function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    let preference=valid.includes(root.dataset.themePreference) ? root.dataset.themePreference : 'system';
    function apply() {
      const resolved=preference==='system' ? (media && media.matches ? 'dark' : 'light') : preference;
      root.dataset.theme=resolved;
      root.dataset.themePreference=preference;
      root.style.colorScheme=resolved;
      select.value=preference;
      $('theme-icon').innerHTML=icon(preference,15);
      syncDropdown(select);
    }
    $('theme-chevron').innerHTML=icon('down',13);
    select.addEventListener('change',()=>{
      preference=valid.includes(select.value) ? select.value : 'system';
      try { localStorage.setItem('soundlog-theme',preference); } catch (_) {}
      apply();
    });
    if (media) {
      const onSystemChange=()=>{if(preference==='system')apply();};
      if (media.addEventListener) media.addEventListener('change',onSystemChange);
      else if (media.addListener) media.addListener(onSystemChange);
    }
    window.addEventListener('storage',e=>{
      if(e.key==='soundlog-theme'){
        preference=valid.includes(e.newValue)?e.newValue:'system';
        apply();
      }
    });
    apply();
  }
  function updateLanguageControls() {
    document.documentElement.lang=state.lang;
    document.title=tr('pageTitle');
    document.querySelector('meta[name="description"]').content=tr('description');
    document.querySelector('.sidebar').setAttribute('aria-label',tr('mainNav'));
    document.querySelector('.brand').setAttribute('aria-label',tr('brandHome'));
    document.querySelector('.brand-sub').textContent=tr('brandSub');
    document.querySelector('.side-label').textContent=tr('library');
    const range=document.querySelector('.range-control');
    range.title=tr('dateFilterTitle');range.querySelector('.sr-only').textContent=tr('dateRangeShort');
    $('range-select').setAttribute('aria-label',tr('dateFilterLabel'));
    for(const [value,key] of [['all','allDates'],['7','last7'],['30','last30'],['month','latestMonth']]) $('range-select').querySelector(`option[value="${value}"]`).textContent=tr(key);
    const theme=document.querySelector('.theme-control');
    theme.title=tr('themeTitle');theme.querySelector('.sr-only').textContent=tr('themeLabel');
    $('theme-select').setAttribute('aria-label',tr('themeLabel'));
    for(const [value,key] of [['system','themeSystem'],['light','themeLight'],['dark','themeDark']]) $('theme-select').querySelector(`option[value="${value}"]`).textContent=tr(key);
    const language=document.querySelector('.language-control');
    language.title=tr('languageTitle');language.querySelector('.sr-only').textContent=tr('languageLabel');
    $('language-select').setAttribute('aria-label',tr('languageLabel'));
    $('language-select').value=state.lang;
    for(const id of ['range-select','theme-select','language-select']) syncDropdown($(id));
    $('detail-dialog').setAttribute('aria-label',tr('dialogLabel'));
  }
  function setUpLanguage() {
    $('language-icon').innerHTML=icon('language',15);$('language-chevron').innerHTML=icon('down',13);
    function update(value,save) {
      state.lang=value==='de'?'de':'en';
      if(save){try{localStorage.setItem('soundlog-language',state.lang);}catch(_){}}
      updateLanguageControls();
      state.warnings=state.invalidFile?[tr('invalidFile')]:validate(state.data);
      render();
    }
    updateLanguageControls();
    $('language-select').addEventListener('change',e=>update(e.target.value,true));
    window.addEventListener('storage',e=>{if(e.key==='soundlog-language')update(e.newValue,false);});
  }
  function setUpStatic() {
    setUpDropdownEvents();
    for(const id of ['range-select','theme-select','language-select']) enhanceDropdown($(id));
    setUpTheme();setUpLanguage();
    $('calendar-icon').innerHTML=icon('calendar',15);$('range-chevron').innerHTML=icon('down',13);
    const detailDialog=$('detail-dialog');
    detailDialog.addEventListener('click',e=>{if(e.target===detailDialog)detailDialog.close();});
    $('range-select').addEventListener('change',e=>{state.range=e.target.value;state.selectedDate=null;state.page=1;render();});
    document.addEventListener('input',e=>{if(e.target.id==='search-input'){state.query=e.target.value;state.page=1;$('list-results').innerHTML=listResults();}});
    document.addEventListener('change',e=>{
      if(e.target.matches('select[data-custom-dropdown]')) syncDropdown(e.target);
      if(e.target.id==='sort-select'){state.sort=e.target.value;state.page=1;$('list-results').innerHTML=listResults();}
    });
    document.addEventListener('click',e=>{
      const el=e.target.closest('[data-action]');if(!el)return;
      const action=el.dataset.action;
      if(action==='navigate'){e.preventDefault();navigate(el.dataset.view);}
      else if(action==='open-item')itemDetail(el.dataset.type,el.dataset.key);
      else if(action==='open-day')dayDetail(el.dataset.date);
      else if(action==='close-detail')closeDetail();
      else if(action==='explain')explain();
      else if(action==='select-day'){
        const date=el.dataset.date;if(!validDate(date)||!state.data[date])return;
        closeDetail();state.selectedDate=date;state.range='all';state.view='tracks';state.query='';state.sort='plays';state.page=1;render();window.scrollTo({top:0,behavior:'smooth'});
      }
      else if(action==='clear-day'){state.selectedDate=null;state.page=1;render();}
      else if(action==='next-page'){state.page++;$('list-results').innerHTML=listResults();}
      else if(action==='prev-page'){state.page--;$('list-results').innerHTML=listResults();}
    });
  }
  async function init() {
    setUpStatic();
    try {
      const loaded=await readDataFile();
      if (loaded) applyData(loaded.data,loaded.warnings);
      else applyData(embeddedData);
    } catch (err) {
      state.invalidFile=!!err.invalidData;
      if (state.invalidFile) {
        showInvalidDataTemplate();
        return;
      }
      applyData(embeddedData);
    }
  }
  init().catch(err=>{console.error(err);if(state.invalidFile)showInvalidDataTemplate();else applyData(embeddedData);});
})();
