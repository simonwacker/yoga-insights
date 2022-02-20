import create from "zustand"
import { Section, Track } from "../models"

const tracks = [
  {
    trackId: "track-volume-1-part-1",
    name: "Grundlegende Einführung",
    fileExtension: "mp3",
    md5FileHashValue: "4154d609e7307a3cc31c9ac1e20ea9d0",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%201-Grundlegende%20Einf%C3%BChrung.mp3",
    description: null,
    hints: [
      { name: "Einführung", duration: 110000 },
      { name: "Grundsätzliche Tipps und Empfehlungen", duration: 128000 },
      { name: "Tipps und Empfehlungen zur Übungsvorbereitung", duration: 96000 },
      { name: "Grundlegendes vor und nach der Übungspraxis", duration: 70000 },
      { name: "Einstimmung und Aufbau der Yogaprogramme", duration: 81000 },
      { name: "Atementwicklung, Atemverständnis Pranayama", duration: 79000 },
      { name: "Körperliche Schulung Asanas mit Tiefe praktizieren", duration: 83000 },
      { name: "Bedeutung der Schlussenstpannung Savasana", duration: 59000 },
    ],
  },
  {
    trackId: "track-volume-1-part-2",
    name: "Regeneratives, entlastendes Abendprogramm",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%202-Regeneratives%20entlastendes%20Abendprogramm.mp3",
    description: null,
    hints: [
      { name: "Bewusste Ausdehnung und Streckung", duration: 116000 },
      { name: "Den unteren Rückenraum entspannen", duration: 80000 },
      { name: "Rückenstärkende Schulterbrücke Setu Bandha", duration: 162000 },
      { name: "Beindehnung liegend", duration: 139000 },
      { name: "Entlastung Lendenbereich - Krokodilshaltung Makarasana I", duration: 126000 },
      { name: "Öffnung Brustraum - Krokodilshaltung Makarasana II", duration: 212000 },
      { name: "Dynamische Katzenhaltung Marjariasana Variation", duration: 343000 },
      { name: "Basis Kniesehnendehnung", duration: 217000 },
      { name: "Intensive Kniesehnendehnung", duration: 354000 },
      { name: "Rückenscan", duration: 154000 },
      { name: "Vollständige Yogaatmung Prana Atmung, Atem der Fülle", duration: 115000 },
      { name: "Wechselatmung Nadi Shodhana", duration: 189000 },
      { name: "Vollständige Körperstimulierung und Tiefenentspannung", duration: 386000 },
      { name: "Bewusster, meditativer Rückzug für Körper und Geist", duration: 313000 },
      { name: "Ausklang", duration: 131000 },
    ],
  },
  {
    trackId: "track-volume-1-part-3",
    name: "Naturklänge zum freien Üben",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%203-Naturkl%C3%A4nge%20zum%20freien%20%C3%9Cben.mp3",
    description: null,
    hints: [
      { name: "Waldimpressionen", duration: 335000 },
      { name: "Lagerfeuer", duration: 333000 },
      { name: "Am Meer", duration: 331000 },
    ],
  },
  {
    trackId: "track-volume-1-part-4",
    name: "Anregendes Yogaprogramm: Rückenstärkung und Rückenentlastung",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%204-Langes%20Yogaprogramm%20R%C3%BCckenst%C3%A4rkung%20und%20R%C3%BCckenentlastung.mp3",
    description: null,
    hints: [
      { name: "Bewusste Ausdehnung und Streckung", duration: 93000 },
      { name: "Anspannung und Entspannung", duration: 67000 },
      { name: "Beckenboden und untere Rückenstärkung", duration: 76000 },
      { name: "Kreuzbeindehnung", duration: 121000 },
      { name: "Entlastung Lendenbereich - Krokodilshaltung 1 Makarasana", duration: 96000 },
      { name: "Innere Einstimmung/Atemmeditation Anapana/Shamatha", duration: 165000 },
      { name: "Atementwicklung Basis Pranayama", duration: 192000 },
      { name: "Vollständige Yogaatmung Prana Atmung, Atem der Fülle", duration: 108000 },
      { name: "Blasebalgartige Atmung Kapalabhati", duration: 344000 },
      { name: "Rückenmassage", duration: 105000 },
      { name: "Ha-Atmung für innere und äußere Reinigung", duration: 172000 },
      { name: "Dehnung für Hüfte und Kreuzbein", duration: 210000 },
      { name: "Grundlegende Kniesehnendehnungen", duration: 261000 },
      { name: "Katzenartige Haltung Marjariasana", duration: 148000 },
      { name: "Pantherhaltung Vyaghrasana", duration: 59000 },
      { name: "Stehende Längs- und Seitenstreckung", duration: 228000 },
      { name: "Belebung des Schultergürtels/Brustexpander", duration: 190000 },
      { name: "Dynamische Vitalatmung", duration: 234000 },
      { name: "Einfacher Drehsitz Vakrasana", duration: 311000 },
      { name: "Nach unten schauender Hund Adho Mukha Svanaasana", duration: 170000 },
      { name: "Haltung der Besinnung und des Ausgleichs Yoga Mudra", duration: 93000 },
      { name: "Nach unten und nach oben schauender Hund", duration: 96000 },
      { name: "Kobrahaltung Bujangasana", duration: 117000 },
      { name: "Halbe Heuschrecke Ardha Shalabhasana", duration: 131000 },
      { name: "Halber Schulterstand Wiparita Karani", duration: 190000 },
      { name: "Vereinfachende Alternative zum Schulterstand", duration: 74000 },
      { name: "Schlussentspannung Savasana", duration: 723000 },
    ],
  },
  {
    trackId: "track-volume-2-part-1",
    name: "Einführung",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%201-Einf%C3%BChrung.mp3",
    description: null,
    hints: [],
  },
  {
    trackId: "track-volume-2-part-2",
    name: "Migräne Soforthilfe 1 & 2 bei Auftretetn erster Symptome",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%202-Soforthilfe%201%262.mp3",
    description:
      "Diese Programme sollen unterstützen, bereits unmittelbar nach dem Auftreten der ersten Migränesymptome das Nervensystem zu ordnen und zu entlasten, um die Reizsymptome zu lindern. Erfahrungen vieler betroffener Menschen belegen, dass die sofortige Yoga-Praxis zu Beginn einer Migräne-Attacke die größte Wirkung erzielt. Nimm Dir also nach Möglichkeit 15-45 Minuten Zeit, um nicht schmerzhafte Migränesymptome über Stunden oder Tage aushalten zu müssen.",
    hints: [
      { name: "Ausgleichende Wechselatmung (Nadi Shodhana)", duration: 178000 },
      { name: "beruhigender, kühlender Atem (Sitali)", duration: 143000 },
      { name: "Reinigende Blasebalgatmung (Kapalabhati)", duration: 564000 },
      { name: "Das Wahrnehmen des Atemflusses", duration: 78000 },
      { name: "Atemachtsamkeit", duration: 334000 },
    ],
  },
  {
    trackId: "track-volume-2-part-3",
    name: "Musik pur",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%203-Musik%20pur.mp3",
    description:
      "Diese Musiksequenz entspricht der Musikfolge von Soforthilfe 1 & 2. Wir wünschen Dir, dass Yoga Insights einen positiven Beitrag zur Verbesserung Deiner Gesundheit leistet!",
    hints: [],
  },
  {
    trackId: "track-volume-2-part-4",
    name: "Anleitung ohne Musik",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%204-Anleitung%20ohne%20Musik.mp3",
    description: null,
    hints: [
      { name: "Ausgleichende Wechselatmung (Nadi Shodhana)", duration: 178000 },
      { name: "beruhigender, kühlender Atem (Sitali)", duration: 143000 },
      { name: "Reinigende Blasebalgatmung (Kapalabhati)", duration: 564000 },
      { name: "Das Wahrnehmen des Atemflusses", duration: 78000 },
      { name: "Atemachtsamkeit", duration: 334000 },
    ],
  },
  {
    trackId: "track-volume-2-part-5",
    name: "Ausführliches Übungsprogramm zur Entspannung von Kopf und Geist",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%205-Ausf%C3%BChrliches%20%C3%9Cbungsprogramm.mp3",
    description:
      "Mit diesem knapp einstündigen Programm kannst Du kontinuierlich lernen, körperliche und innere Anspannung zu verwandeln. Die geführte Abschlussentspannung Savasana lässt sich auch unabhängig zur allgemeinen Förderung von Ruhe, Wohlbefinden und positiver Ruhe nutzen.",
    hints: [],
  },
  {
    trackId: "track-volume-2-part-6",
    name: "Naturklänge",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%206-Naturkl%C3%A4nge.mp3",
    description: "Diese Meeresathmosphäre hilft Dir beim selbständigen Üben.",
    hints: [],
  },
]

const indexedTracks = tracks.reduce((map, track) => {
  map.set(track.trackId, track)
  return map
}, new Map<string, Track>())

const classSections = [
  {
    title: "Rückenstärkung und Entlastung",
    data: ["track-volume-1-part-1", "track-volume-1-part-2", "track-volume-1-part-4"],
  },
  {
    title: "Spannungsausgleich und Migräneprophylaxe",
    data: [
      "track-volume-2-part-1",
      "track-volume-2-part-2",
      "track-volume-2-part-4",
      "track-volume-2-part-5",
    ],
  },
]

const poseSections = [
  {
    title: "Rückenstärkung und Entlastung",
    data: ["track-volume-1-part-1", "track-volume-1-part-2", "track-volume-1-part-4"],
  },
  {
    title: "Spannungsausgleich und Migräneprophylaxe",
    data: [
      "track-volume-2-part-1",
      "track-volume-2-part-2",
      "track-volume-2-part-4",
      "track-volume-2-part-5",
    ],
  },
]

const musicSections = [
  {
    title: "Rückenstärkung und Entlastung",
    data: ["track-volume-1-part-3"],
  },
  {
    title: "Spannungsausgleich und Migräneprophylaxe",
    data: ["track-volume-2-part-3", "track-volume-2-part-6"],
  },
]

const fallbackTrack = {
  trackId: "track-volume-1-part-1",
  name: "Grundlegende Einführung",
  fileExtension: "mp3",
  md5FileHashValue: "4154d609e7307a3cc31c9ac1e20ea9d0",
  webUri:
    "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%201-Grundlegende%20Einf%C3%BChrung.mp3",
}

type State = {
  getTrack: (trackId: string) => Track
  classSections: Section[]
  poseSections: Section[]
  musicSections: Section[]
}

export const useTrackStore = create<State>((_set, _get) => ({
  getTrack: (trackId: string) => {
    const track = indexedTracks.get(trackId)
    if (track !== undefined) {
      return track
    } else {
      console.error(`Unknown track ID ${trackId}`)
      return fallbackTrack
    }
  },
  classSections: classSections,
  poseSections: poseSections,
  musicSections: musicSections,
}))
