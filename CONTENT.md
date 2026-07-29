# Texte bearbeiten / Editing the texts

Alle sichtbaren Texte der Website liegen im Ordner [`content/`](content/).
Du brauchst keine Programmierkenntnisse, um sie zu ändern — und du kannst
die Website damit auch nicht kaputt machen.

*All visible texts live in the [`content/`](content/) folder. You don't need
any coding knowledge to change them, and you can't break the site by doing so.*

---

## Welche Datei ist wofür?

| Datei | Inhalt |
|---|---|
| `content/site.en.md` | Startseite, Englisch |
| `content/site.de.md` | Startseite, Deutsch |
| `content/imprint.en.md` | Imprint (Englisch) |
| `content/imprint.de.md` | Impressum (Deutsch) |
| `content/privacy.en.md` | Privacy policy (Englisch) |
| `content/privacy.de.md` | Datenschutzerklärung (Deutsch) |
| `content/confirmed.md` | Seite nach der Newsletter-Bestätigung — **eine Datei, beide Sprachen** |

Ändere immer **beide Sprachversionen**, sonst passen Deutsch und Englisch
nicht mehr zusammen.

Ausnahme: `confirmed.md` enthält beide Sprachen in einer Datei, getrennt
durch eine Linie aus drei Bindestrichen (`---`). Wer aus der Bestätigungs-
E-Mail kommt, öffnet den Link oft in einem Browser ohne gespeicherte
Sprachwahl — deshalb steht dort beides untereinander.

Der Text der Bestätigungs-**E-Mail** liegt nicht hier, sondern direkt in
Brevo. Die Vorlage dafür ist `email/doi-confirmation.html`.

---

## So änderst du einen Text (direkt in GitHub)

1. Öffne die gewünschte Datei im Browser, z. B. `content/site.de.md`.
2. Klicke rechts oben auf das **Stift-Symbol** („Edit this file").
3. Ändere den Text.
4. Scrolle nach unten, gib bei „Commit changes" eine kurze Notiz ein
   (z. B. „Hero-Text angepasst") und klicke auf **Commit changes**.
5. Fertig. Die Website aktualisiert sich nach ein bis zwei Minuten von selbst.

> Tipp: Wenn du unsicher bist, wähle beim Commit „Create a new branch and
> start a pull request". Dann kann jemand die Änderung vorher gegenlesen.

---

## Aufbau der Startseiten-Dateien

`site.de.md` und `site.en.md` bestehen aus Blöcken. Jeder Block beginnt mit
zwei Rauten und einem **Schlüssel**:

```
## hero_title
Mehr tragen.
Weiter kommen.

## hero_text
Wir bauen ein Abenteuer-Cargobike für Schotterwege, wilde Orte und
Nächte im Freien.
```

**Wichtig:**

- Die Schlüssel (`hero_title`, `hero_text`, …) **nicht umbenennen, löschen
  oder umsortieren**. Die Website sucht die Texte über diese Namen.
- Nur den Text **unter** einem Schlüssel ändern.
- Fehlt ein Schlüssel, bleibt an dieser Stelle der englische Standardtext
  stehen — die Seite bleibt also funktionsfähig.

### Wo steht welcher Schlüssel auf der Seite?

| Schlüssel | Stelle auf der Seite |
|---|---|
| `page_title` | Browser-Tab und Suchergebnisse |
| `meta_description` | Beschreibung in Suchmaschinen |
| `og_title`, `og_description` | Vorschau beim Teilen (z. B. WhatsApp) |
| `hero_title`, `hero_text`, `hero_button` | großes Bild ganz oben |
| `section1_*` … `section4_*` | die Textabschnitte zwischen den Bildern |
| `quote_text`, `quote_list` | das große Zitat |
| `form_*` | Newsletter-Anmeldung |
| `form_msg_*` | Fehlermeldungen im Anmeldeformular |
| `footer_*` | Fußzeile |
| `back_home` | Link zurück zur Startseite auf den Rechtsseiten |

---

## Aufbau der Rechtsseiten

`imprint.*.md` und `privacy.*.md` sind normale Dokumente ohne Schlüssel.
Du kannst sie frei umschreiben, Abschnitte hinzufügen oder entfernen.

Alles in `[eckigen Klammern]` ist ein Platzhalter und muss vor dem
Livegang durch echte Angaben ersetzt werden.

---

## Erlaubte Formatierung

| Schreibweise | Ergebnis |
|---|---|
| `**fett**` | **fett** |
| `*kursiv*` | *kursiv* |
| `[Linktext](https://example.com)` | ein Link |
| `# Überschrift` | große Überschrift *(nur auf den Rechtsseiten)* |
| `## Überschrift` | Zwischenüberschrift *(nur auf den Rechtsseiten)* |
| `- Punkt` | Aufzählung *(nur auf den Rechtsseiten)* |
| Zeilenumbruch | Zeilenumbruch |
| Leerzeile | Absatzabstand |

Der Zeilenumbruch funktioniert auch in den Formularmeldungen (`form_error`,
`form_success`, `form_msg_*`): Einfach die Zeile umbrechen, wo der Text
getrennt werden soll.

**HTML ist bewusst nicht erlaubt.** Wenn du `<b>` oder `<script>` schreibst,
erscheint das als normaler Text auf der Seite. Das ist eine Sicherheits-
maßnahme: Ein Tippfehler kann die Website nicht zerstören.

---

## Zeilen, die mit `<!--` beginnen

Das sind Kommentare für dich als Redakteur*in. Sie erscheinen **nicht** auf
der Website. Du kannst sie stehen lassen.

---

## Vorschau vor dem Veröffentlichen

Die Texte werden per JavaScript geladen. Ein direkter Doppelklick auf
`index.html` funktioniert deshalb **nicht** — der Browser blockiert das
Laden lokaler Dateien.

Lokale Vorschau (im Projektordner im Terminal):

```
python3 -m http.server 8000
```

Dann [http://localhost:8000](http://localhost:8000) im Browser öffnen.

Sprache direkt aufrufen: `http://localhost:8000/?lang=de`
