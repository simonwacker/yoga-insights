import { MaterialCommunityIcons } from "@expo/vector-icons"
import React from "react"
import { Linking, ViewStyle } from "react-native"
import { Button, FAB, Headline, Paragraph, Subheading } from "react-native-paper"
import { Screen } from "../components"
import { WelcomeScreenNavigationProp, WelcomeScreenRouteProp } from "../navigators"

const FAB_STYLE: ViewStyle = {
  position: "absolute",
  margin: 16,
  right: 0,
  bottom: 0,
}

export type WelcomeScreenProps = {
  route: WelcomeScreenRouteProp
  navigation: WelcomeScreenNavigationProp
}

const yogaInsightsUrl = "https://www.yoga-insights.de"

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <Screen preset="fixed" onAccessibilityEscape={navigation.goBack}>
      <Screen preset="scroll" onAccessibilityEscape={navigation.goBack}>
        <Headline>Yoga Insights</Headline>
        <Subheading>Für Menschen, die nach Innen schauen</Subheading>
        <Button onPress={() => Linking.openURL(yogaInsightsUrl)}>
          Öffne die Yoga Insights Website
        </Button>
        <Paragraph>
          Yogasequenzen mit thematischen Schwerpunkten für Menschen mit und ohne Yogaerfahrung. Eine
          Kooperation von Yogazentrum/Yoga College und CitySoundStudio.
        </Paragraph>
        <Paragraph>
          Der von Geburt an blinde Komponist und Musiker Jens Gebel, bekannt u.a. durch seine
          Zusammenarbeit mit der Jazzformation Tok Tok Tok, konnte in seinen Yogaschulungen bei
          Jürgen Ries die Erfahrung tausender Kursteilnehmer*innen bestätigen, die durch regelmäßige
          Hatha- und Raja-Yogapraxis Wege fanden, Spannungszustände zu verwandeln, den Geist neu
          auszurichten und die eigene Gesundheit spürbar zu verbessern. Die dabei verwendeten Yoga
          Übungen haben ihren Wert über viele Jahre gezeigt und sind oft verblüffend einfach,
          benötigen also in der Mehrzahl weder Vorkenntnisse noch besondere körperlich-geistige
          Voraussetzungen.
        </Paragraph>
        <Paragraph>
          YOGA INSIGHTS entstand auf Anregung von Jens Gebel, der seine Erkenntnisse auch anderen
          Menschen mit Einschränkungen der Sehkraft zugänglich machen wollte. Im
          Realisierungsprozess stellten wir fest, dass viele Menschen unabhängig von ihrer
          Sehfähigkeit aus den Programmen Nutzen ziehen können. Die Übungen sind sehr detailreich
          beschrieben. YOGA INSIGHTS verzichtet bewusst auf visuelle Inhalte, um die eigene innere
          Wahrnehmung und eine achtsame Präsenz zu unterstützen. Wir empfehlen daher, mit
          geschlossenen Augen zu üben.
        </Paragraph>
        <Paragraph>
          Wir wünschen uns, dass die Hörprogramme von YOGA INSIGHTS ein positiver Beitrag zu
          ganzheitlicher Gesundheit und innerer Ausgeglichenheit sind. YOGA INSIGHTS versteht sich
          als unterstützendes prophylaktisches Angebot, ersetzt bei Gesundheitsbeschwerden aber
          nicht eine medizinische Diagnose und entsprechende Begleitung.
        </Paragraph>
        <Paragraph>
          Jürgen Ries leitet seit 2005 das Yogazentrum Freiburg und bildet seit 2006 im Yoga College
          Freiburg aus. Er studierte Yoga in der legendären Scuola Yoga bei Selvarajan Yesudian und
          Elisabeth Haich.
        </Paragraph>
        <Paragraph>
          In jedem Menschen ist etwas Heilsames, eine ursprüngliche Quelle von Wissen und Weisheit
          angelegt. YOGA INSIGHTS nutzt diese Quelle mit geeigneten Übungen und kann dadurch
          besonders bei Spannungs-zuständen befreiend wirken. Du kannst nur lernen, dass Du das, was
          Du suchst, schon selber bist. Alles Lernen ist das Erinnern an etwas, das längst da ist
          und nur auf Entdeckung wartet. Alles Lernen ist nur das Wegräumen von Ballast, bis so
          etwas übrig bleibt wie eine leuchtende innere Stille. Bis Du merkst, dass Du selbst der
          Ursprung von Frieden und Liebe bist." (Sokrates, griechischer Philosoph )
        </Paragraph>
        <Paragraph>
          Diese yogatherapeutische Doppel-CD wendet sich an Menschen, die unter Spannungen,
          Spannungskopfschmerz oder CD 1 enthält eine thematische Einführung sowie zwei
          Kurzprogramme zur Sofortmaßnahme bei akuten Symptomen. CD 2 unterstützt durch ein
          ausführliches Präventionsprogramm..Nutzen und Wert dieser oft verblüffend einfachen
          Übungen, die weder Vorkenntnisse noch besondere körperliche Voraussetzungen benötigen,
          wurden im Laufe der Jahre von vielen Betroffenen bestätigt.
        </Paragraph>
        <Paragraph>
          Die Übungen von YOGA INSIGHTS unterstützen auf vielschichtige und nachhaltige Weise. Über
          die Integration von Körper, Atem und Geist entsteht ein gesunder innerer Raum, aus dem
          unser gesamter Organismus gestärkt hervorgeht. Rückenschmerzen und damit zusammenhängende
          Beschwerden sind die Volkskrankheit Nummer eins. Das von Jürgen Ries, Leiter des
          Yogazentrums/Yogacollege Freiburg entwickelte und angeleitete Übungsprogramm bietet
          wirkungsvolle Möglichkeiten, den ganzen Rückenraum im Wechselspiel von Anspannung und
          Entspannung gleichermaßen zu stärken und zu entlasten. Hatha-Yoga ist zu Recht seit Jahren
          als eine der am besten wirkenden Physiotherapien anerkannt.
        </Paragraph>
        <Paragraph>
          Moshe Feldenkrais, Entwickler der gleichnamigen Körpertherapie (1904-1984): „Ein jeder
          bewegt sich, empfindet, denkt, spricht auf die ihm eigene Weise --- dem Bild entsprechend,
          das er sich im Laufe seines Lebens von sich selbst gebildet hat. Um die Art und Weise
          seines Tuns zu ändern, muss er das Bild von sich ändern, das er in sich trägt.“
        </Paragraph>
        <Paragraph>
          Der griechische Philosoph Platon (428-348 v. Chr.) sagte dazu: „Der Körper kann nie ohne
          die Seele geheilt werden. Das Skelett und die Bewegungen des Körpers sind zentral für die
          Seele.“
        </Paragraph>
        <Subheading>Das YOGA INSIGHTS-Team</Subheading>
        <Paragraph>
          Jürgen Ries schöpft bei der Zusammenstellung und Anleitung der Übungen aus seinem
          profunden Yogawissen und langjähriger Erfahrung in der Leitung von Yoga- und
          Meditationsklassen. Während der Aufnahmesessions in seinem Tonstudio achtet Jens Gebel mit
          großer Aufmerksamkeit immer wieder auf Genauigkeit in der Anleitung und leistet dadurch
          einen entscheidenden Beitrag zum Gelingen dieser Aufnahmen. Auch die eigens für YOGA
          INSIGHTS komponierte Musik stammt von ihm. Saxophonistin und Produzentin Veronica Reiff
          ermöglicht durch ihr technisches Knowhow die Realisation des Projektes und schafft einen
          professionellen Rahmen, von dem alle Beteiligten profitieren.
        </Paragraph>
        <Subheading>YOGA INSIGHTS </Subheading>
        <Paragraph>
          Auf Initiave des von Geburt an blinden Musikproduzenten Jens Gebel entstand YOGA INSIGHTS,
          eine Kooperation von Yogazentrum/Yoga College Freiburg und CitySoundStudio. Yogatherapeut
          und Meditationslehrer Jürgen Ries, Jens Gebel und das Team von YOGA INSIGHTS entwickeln
          Hörprogramme, durch die viele Menschen unabhängig von ihrer Sehfähigkeit Nutzen ziehen
          können. Die dabei verwendeten Yoga-Übungen haben sich in unseren Kursen tausendfach
          bewährt. Sie sind oft verblüffend einfach, dadurch für Menschen mit und ohne Yogaerfahrung
          gleichermaßen geeignet. Die Übungen sind detailliert beschrieben. YOGA INSIGHTS verzichtet
          bewusst auf visuelle Inhalte, um die eigene innere Wahrnehmung zu unterstützen und zu
          vertiefen. Wir wünschen uns, dass die Hörprogramme von YOGA INSIGHTS einen positiven
          Beitrag zu Ihrer ganzheitlichen Gesundheit und innerer Ausgeglichenheit leisten werden!
          Die Übungsprogramme sind sowohl auf CD wie zukünftig auch als App verfügbar, weitere Infos
          unter:
        </Paragraph>
        <Button onPress={() => Linking.openURL("mailto:info@yoga-insights.de")}>
          info@yoga-insights.de
        </Button>
        <Button onPress={() => Linking.openURL("https://www.citysoundstudio.de")}>
          citysoundstudio.de
        </Button>
        <Button onPress={() => Linking.openURL("https://www.yogazentrum-freiburg.de")}>
          yogazentrum-freiburg.de
        </Button>
      </Screen>
      <FAB
        label="Zu den Übungen"
        icon={(props) => <MaterialCommunityIcons name="plus" {...props} />}
        onPress={() => navigation.navigate("tabs", { screen: "classes" })}
        style={FAB_STYLE}
      />
    </Screen>
  )
}
