import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "outputs/comptabilite-boutique";
await fs.mkdir(outputDir, { recursive: true });

const wb = Workbook.create();

const dashboard = wb.worksheets.add("Tableau de bord");
const journal = wb.worksheets.add("Journal");
const categories = wb.worksheets.add("Categories");
const capital = wb.worksheets.add("Capital");
const stock = wb.worksheets.add("Stock");
const checks = wb.worksheets.add("Checks");

for (const sheet of [dashboard, journal, categories, capital, stock, checks]) {
  sheet.showGridLines = false;
}

const colors = {
  navy: "#17324D",
  teal: "#0F766E",
  blue: "#2563EB",
  green: "#15803D",
  red: "#B91C1C",
  amber: "#F59E0B",
  lightBlue: "#EFF6FF",
  lightGreen: "#ECFDF5",
  lightRed: "#FEF2F2",
  lightAmber: "#FFFBEB",
  gray: "#F3F4F6",
  border: "#D1D5DB",
  text: "#111827",
  muted: "#6B7280",
};

function header(range, fill = colors.navy) {
  range.format = {
    fill,
    font: { bold: true, color: "#FFFFFF" },
    wrapText: true,
    horizontalAlignment: "center",
    verticalAlignment: "middle",
    borders: { preset: "all", style: "thin", color: colors.border },
  };
}

function sectionTitle(range, value) {
  range.merge();
  range.values = [[value]];
  range.format = {
    fill: colors.navy,
    font: { bold: true, color: "#FFFFFF", size: 14 },
    verticalAlignment: "middle",
  };
}

function money(range) {
  range.format.numberFormat = '#,##0.00 "EUR";[Red]-#,##0.00 "EUR";-';
}

function percent(range) {
  range.format.numberFormat = "0.0%";
}

function dateFmt(range) {
  range.format.numberFormat = "yyyy-mm-dd";
}

// Categories and settings
categories.getRange("A1:E1").values = [["Types", "Categories depenses", "Categories gains", "Modes paiement", "Statuts"]];
header(categories.getRange("A1:E1"), colors.teal);
categories.getRange("A2:A8").values = [
  ["Vente"],
  ["Depense"],
  ["Capital entrant"],
  ["Retrait capital"],
  ["Achat stock"],
  ["Ajustement"],
  ["Autre"],
];
categories.getRange("B2:B15").values = [
  ["Achat marchandise"],
  ["Transport"],
  ["Publicite"],
  ["Emballage"],
  ["Frais plateforme"],
  ["Loyer"],
  ["Electricite"],
  ["Internet / telephone"],
  ["Salaire / prestataire"],
  ["Impots / taxes"],
  ["Frais bancaires"],
  ["Materiel"],
  ["Retour client"],
  ["Autre depense"],
];
categories.getRange("C2:C9").values = [
  ["Vente boutique"],
  ["Vente en ligne"],
  ["Prestation"],
  ["Remboursement recu"],
  ["Remise fournisseur"],
  ["Autre gain"],
  ["Apport proprietaire"],
  ["Subvention"],
];
categories.getRange("D2:D8").values = [
  ["Especes"],
  ["Mobile money"],
  ["Carte bancaire"],
  ["Virement"],
  ["PayPal"],
  ["Cheque"],
  ["Autre"],
];
categories.getRange("E2:E6").values = [["Payee"], ["Encaissee"], ["A payer"], ["A recevoir"], ["Annulee"]];
categories.getRange("A:E").format.columnWidthPx = 170;

// Journal
journal.getRange("A1:N1").values = [[
  "Date",
  "Type",
  "Categorie",
  "Description",
  "Mode paiement",
  "Fournisseur / client",
  "Reference",
  "Montant TTC",
  "TVA",
  "Montant HT",
  "Quantite",
  "Statut",
  "Mois",
  "Notes",
]];
header(journal.getRange("A1:N1"));
journal.freezePanes.freezeRows(1);
journal.getRange("A2:A501").values = Array.from({ length: 500 }, () => [null]);
journal.getRange("J2").formulas = [["=IF(H2=\"\",\"\",H2-I2)"]];
journal.getRange("J2:J501").fillDown();
journal.getRange("M2").formulas = [["=IF(A2=\"\",\"\",TEXT(A2,\"yyyy-mm\"))"]];
journal.getRange("M2:M501").fillDown();
dateFmt(journal.getRange("A2:A501"));
money(journal.getRange("H2:J501"));
journal.getRange("K2:K501").format.numberFormat = "#,##0";
journal.getRange("A:N").format.columnWidthPx = 130;
journal.getRange("D:D").format.columnWidthPx = 260;
journal.getRange("N:N").format.columnWidthPx = 240;
journal.tables.add("A1:N501", true, "JournalTransactions");
journal.getRange("B2:B501").dataValidation = { rule: { type: "list", formula1: "Categories!$A$2:$A$8" } };
journal.getRange("C2:C501").dataValidation = { rule: { type: "list", formula1: "Categories!$B$2:$B$15" } };
journal.getRange("E2:E501").dataValidation = { rule: { type: "list", formula1: "Categories!$D$2:$D$8" } };
journal.getRange("L2:L501").dataValidation = { rule: { type: "list", formula1: "Categories!$E$2:$E$6" } };

// Dashboard
sectionTitle(dashboard.getRange("A1:M2"), "Comptabilite boutique - suivi depenses, gains, capital et stock");
dashboard.getRange("A4").values = [["Annee suivie"]];
dashboard.getRange("B4").values = [[2026]];
dashboard.getRange("A4:B4").format = {
  fill: colors.lightBlue,
  font: { bold: true, color: colors.text },
  borders: { preset: "all", style: "thin", color: colors.border },
};
dashboard.getRange("B4").format = { fill: "#FFFF00", font: { bold: true, color: "#0000FF" } };

dashboard.getRange("A6:D11").values = [
  ["Indicateur", "Valeur", "Formule", "Lecture rapide"],
  ["Total gains / ventes", null, "Journal: Type = Vente", "Argent gagne par l'activite"],
  ["Total depenses", null, "Depense + Achat stock", "Sorties liees a l'activite"],
  ["Resultat net", null, "Gains - depenses", "Benefice avant retrait personnel"],
  ["Capital entrant", null, "Apports", "Argent ajoute a l'entreprise"],
  ["Tresorerie estimee", null, "Gains + capital - depenses - retraits", "Solde theorique"],
];
header(dashboard.getRange("A6:D6"), colors.teal);
dashboard.getRange("B7:B11").formulas = [
  ["=SUMIFS(Journal!$H$2:$H$501,Journal!$B$2:$B$501,\"Vente\",Journal!$L$2:$L$501,\"<>Annulee\")"],
  ["=SUMIFS(Journal!$H$2:$H$501,Journal!$B$2:$B$501,\"Depense\",Journal!$L$2:$L$501,\"<>Annulee\")+SUMIFS(Journal!$H$2:$H$501,Journal!$B$2:$B$501,\"Achat stock\",Journal!$L$2:$L$501,\"<>Annulee\")"],
  ["=B7-B8"],
  ["=SUMIFS(Journal!$H$2:$H$501,Journal!$B$2:$B$501,\"Capital entrant\",Journal!$L$2:$L$501,\"<>Annulee\")"],
  ["=B7+B10-B8-SUMIFS(Journal!$H$2:$H$501,Journal!$B$2:$B$501,\"Retrait capital\",Journal!$L$2:$L$501,\"<>Annulee\")"],
];
money(dashboard.getRange("B7:B11"));
dashboard.getRange("A6:D11").format.borders = { preset: "all", style: "thin", color: colors.border };
dashboard.getRange("A6:D11").format.wrapText = true;

dashboard.getRange("A14:M14").values = [["Mois", "Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sep", "Oct", "Nov", "Dec"]];
dashboard.getRange("A15:M20").values = [
  ["Gains", null, null, null, null, null, null, null, null, null, null, null, null],
  ["Depenses", null, null, null, null, null, null, null, null, null, null, null, null],
  ["Achat stock", null, null, null, null, null, null, null, null, null, null, null, null],
  ["Resultat net", null, null, null, null, null, null, null, null, null, null, null, null],
  ["Capital net", null, null, null, null, null, null, null, null, null, null, null, null],
  ["Marge nette", null, null, null, null, null, null, null, null, null, null, null, null],
];
header(dashboard.getRange("A14:M14"), colors.navy);
dashboard.getRange("B15").formulas = [["=SUMIFS(Journal!$H$2:$H$501,Journal!$B$2:$B$501,\"Vente\",Journal!$A$2:$A$501,\">=\"&DATE($B$4,COLUMN()-1,1),Journal!$A$2:$A$501,\"<\"&EDATE(DATE($B$4,COLUMN()-1,1),1),Journal!$L$2:$L$501,\"<>Annulee\")"]];
dashboard.getRange("B16").formulas = [["=SUMIFS(Journal!$H$2:$H$501,Journal!$B$2:$B$501,\"Depense\",Journal!$A$2:$A$501,\">=\"&DATE($B$4,COLUMN()-1,1),Journal!$A$2:$A$501,\"<\"&EDATE(DATE($B$4,COLUMN()-1,1),1),Journal!$L$2:$L$501,\"<>Annulee\")"]];
dashboard.getRange("B17").formulas = [["=SUMIFS(Journal!$H$2:$H$501,Journal!$B$2:$B$501,\"Achat stock\",Journal!$A$2:$A$501,\">=\"&DATE($B$4,COLUMN()-1,1),Journal!$A$2:$A$501,\"<\"&EDATE(DATE($B$4,COLUMN()-1,1),1),Journal!$L$2:$L$501,\"<>Annulee\")"]];
dashboard.getRange("B18").formulas = [["=B15-B16-B17"]];
dashboard.getRange("B19").formulas = [["=SUMIFS(Journal!$H$2:$H$501,Journal!$B$2:$B$501,\"Capital entrant\",Journal!$A$2:$A$501,\">=\"&DATE($B$4,COLUMN()-1,1),Journal!$A$2:$A$501,\"<\"&EDATE(DATE($B$4,COLUMN()-1,1),1),Journal!$L$2:$L$501,\"<>Annulee\")-SUMIFS(Journal!$H$2:$H$501,Journal!$B$2:$B$501,\"Retrait capital\",Journal!$A$2:$A$501,\">=\"&DATE($B$4,COLUMN()-1,1),Journal!$A$2:$A$501,\"<\"&EDATE(DATE($B$4,COLUMN()-1,1),1),Journal!$L$2:$L$501,\"<>Annulee\")"]];
dashboard.getRange("B20").formulas = [["=IF(B15=0,\"\",B18/B15)"]];
dashboard.getRange("B15:B20").copyTo(dashboard.getRange("C15:M20"), "formulas");
money(dashboard.getRange("B15:M19"));
percent(dashboard.getRange("B20:M20"));
dashboard.getRange("A14:M20").format.borders = { preset: "all", style: "thin", color: colors.border };
dashboard.getRange("A15:A20").format = { font: { bold: true, color: colors.text }, fill: colors.gray };

const chart = dashboard.charts.add("line", dashboard.getRange("A14:M18"));
chart.title = "Gains, depenses et resultat net par mois";
chart.hasLegend = true;
chart.xAxis = { axisType: "textAxis" };
chart.yAxis = { numberFormatCode: '#,##0 "EUR"' };
chart.setPosition("F4", "M12");

dashboard.getRange("A23:M27").values = [
  ["Mode d'emploi", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["1. Saisir chaque mouvement dans l'onglet Journal: vente, depense, achat stock, apport ou retrait de capital.", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["2. Mettre le statut Annulee pour ignorer une ligne sans la supprimer.", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["3. Modifier Categories si tu veux ajouter tes propres postes de depense ou modes de paiement.", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["4. Changer l'annee en B4 pour analyser une autre annee.", "", "", "", "", "", "", "", "", "", "", "", ""],
];
dashboard.getRange("A23:M23").merge();
dashboard.getRange("A24:M27").merge(true);
dashboard.getRange("A23:M27").format = { fill: colors.lightAmber, wrapText: true, borders: { preset: "all", style: "thin", color: colors.border } };
dashboard.getRange("A23").format.font = { bold: true, color: colors.text };
dashboard.getRange("A:M").format.columnWidthPx = 95;
dashboard.getRange("A:A").format.columnWidthPx = 165;
dashboard.getRange("C:D").format.columnWidthPx = 150;

// Capital
capital.getRange("A1:F1").values = [["Date", "Type", "Description", "Montant", "Mode paiement", "Reference"]];
header(capital.getRange("A1:F1"), colors.teal);
capital.getRange("A2").formulas = [["=FILTER(Journal!A2:A501,(Journal!B2:B501=\"Capital entrant\")+(Journal!B2:B501=\"Retrait capital\"))"]];
capital.getRange("B2").formulas = [["=FILTER(Journal!B2:B501,(Journal!B2:B501=\"Capital entrant\")+(Journal!B2:B501=\"Retrait capital\"))"]];
capital.getRange("C2").formulas = [["=FILTER(Journal!D2:D501,(Journal!B2:B501=\"Capital entrant\")+(Journal!B2:B501=\"Retrait capital\"))"]];
capital.getRange("D2").formulas = [["=FILTER(Journal!H2:H501,(Journal!B2:B501=\"Capital entrant\")+(Journal!B2:B501=\"Retrait capital\"))"]];
capital.getRange("E2").formulas = [["=FILTER(Journal!E2:E501,(Journal!B2:B501=\"Capital entrant\")+(Journal!B2:B501=\"Retrait capital\"))"]];
capital.getRange("F2").formulas = [["=FILTER(Journal!G2:G501,(Journal!B2:B501=\"Capital entrant\")+(Journal!B2:B501=\"Retrait capital\"))"]];
dateFmt(capital.getRange("A2:A501"));
money(capital.getRange("D2:D501"));
capital.getRange("A:F").format.columnWidthPx = 150;
capital.getRange("C:C").format.columnWidthPx = 260;

// Stock
stock.getRange("A1:I1").values = [["Produit", "SKU", "Stock initial", "Entrees", "Sorties vendues", "Ajustements", "Stock final", "Cout unitaire", "Valeur stock"]];
header(stock.getRange("A1:I1"), colors.teal);
stock.getRange("A2:I11").values = [
  ["Produit exemple", "SKU-001", 0, 0, 0, 0, null, 0, null],
  ["", "", null, null, null, null, null, null, null],
  ["", "", null, null, null, null, null, null, null],
  ["", "", null, null, null, null, null, null, null],
  ["", "", null, null, null, null, null, null, null],
  ["", "", null, null, null, null, null, null, null],
  ["", "", null, null, null, null, null, null, null],
  ["", "", null, null, null, null, null, null, null],
  ["", "", null, null, null, null, null, null, null],
  ["", "", null, null, null, null, null, null, null],
];
stock.getRange("G2").formulas = [["=IF(A2=\"\",\"\",C2+D2-E2+F2)"]];
stock.getRange("G2:G101").fillDown();
stock.getRange("I2").formulas = [["=IF(A2=\"\",\"\",G2*H2)"]];
stock.getRange("I2:I101").fillDown();
stock.getRange("C2:G101").format.numberFormat = "#,##0";
money(stock.getRange("H2:I101"));
stock.tables.add("A1:I101", true, "StockBoutique");
stock.getRange("A:I").format.columnWidthPx = 135;
stock.getRange("A:A").format.columnWidthPx = 220;

// Checks
checks.getRange("A1:E1").values = [["Controle", "Resultat", "Details", "Statut", "Action"]];
header(checks.getRange("A1:E1"), colors.navy);
checks.getRange("A2:E6").values = [
  ["Dates manquantes dans le journal", null, "Lignes avec montant mais sans date", null, "Ajouter la date"],
  ["Types manquants", null, "Lignes avec montant mais sans type", null, "Choisir un type"],
  ["Montants negatifs", null, "Montants TTC inferieurs a 0", null, "Verifier le signe"],
  ["TVA superieure au TTC", null, "TVA > montant TTC", null, "Corriger montant ou TVA"],
  ["Statut global", null, "Tous les controles doivent etre OK", null, "Corriger les lignes signalees"],
];
checks.getRange("B2:B5").formulas = [
  ["=COUNTIFS(Journal!$H$2:$H$501,\">0\",Journal!$A$2:$A$501,\"\")"],
  ["=COUNTIFS(Journal!$H$2:$H$501,\">0\",Journal!$B$2:$B$501,\"\")"],
  ["=COUNTIF(Journal!$H$2:$H$501,\"<0\")"],
  ["=SUMPRODUCT(--(Journal!$I$2:$I$501>Journal!$H$2:$H$501),--(Journal!$H$2:$H$501<>\"\"))"],
];
checks.getRange("B6").formulas = [["=SUM(B2:B5)"]];
checks.getRange("D2").formulas = [["=IF(B2=0,\"OK\",\"A verifier\")"]];
checks.getRange("D2:D6").fillDown();
checks.getRange("A1:E6").format.borders = { preset: "all", style: "thin", color: colors.border };
checks.getRange("A:E").format.columnWidthPx = 180;
checks.getRange("C:C").format.columnWidthPx = 260;

// Add a few friendly example transactions to make the template understandable.
journal.getRange("A2:N7").values = [
  [new Date(2026, 0, 3), "Capital entrant", "Apport proprietaire", "Apport initial boutique", "Virement", "Proprietaire", "CAP-001", 1000, 0, null, 1, "Encaissee", null, "Exemple a remplacer"],
  [new Date(2026, 0, 5), "Achat stock", "Achat marchandise", "Premier achat produits", "Virement", "Fournisseur", "ACH-001", 350, 0, null, 10, "Payee", null, "Exemple a remplacer"],
  [new Date(2026, 0, 8), "Vente", "Vente boutique", "Vente client", "Especes", "Client", "VTE-001", 120, 0, null, 2, "Encaissee", null, "Exemple a remplacer"],
  [new Date(2026, 0, 10), "Depense", "Transport", "Livraison fournisseur", "Mobile money", "Transporteur", "DEP-001", 25, 0, null, 1, "Payee", null, "Exemple a remplacer"],
  [new Date(2026, 0, 15), "Vente", "Vente en ligne", "Commande en ligne", "Carte bancaire", "Client web", "VTE-002", 180, 0, null, 3, "Encaissee", null, "Exemple a remplacer"],
  [new Date(2026, 0, 20), "Retrait capital", "Autre gain", "Retrait personnel", "Virement", "Proprietaire", "RET-001", 50, 0, null, 1, "Payee", null, "Exemple a remplacer"],
];
journal.getRange("J2:J7").formulas = [
  ["=IF(H2=\"\",\"\",H2-I2)"],
  ["=IF(H3=\"\",\"\",H3-I3)"],
  ["=IF(H4=\"\",\"\",H4-I4)"],
  ["=IF(H5=\"\",\"\",H5-I5)"],
  ["=IF(H6=\"\",\"\",H6-I6)"],
  ["=IF(H7=\"\",\"\",H7-I7)"],
];
journal.getRange("M2:M7").formulas = [
  ["=IF(A2=\"\",\"\",TEXT(A2,\"yyyy-mm\"))"],
  ["=IF(A3=\"\",\"\",TEXT(A3,\"yyyy-mm\"))"],
  ["=IF(A4=\"\",\"\",TEXT(A4,\"yyyy-mm\"))"],
  ["=IF(A5=\"\",\"\",TEXT(A5,\"yyyy-mm\"))"],
  ["=IF(A6=\"\",\"\",TEXT(A6,\"yyyy-mm\"))"],
  ["=IF(A7=\"\",\"\",TEXT(A7,\"yyyy-mm\"))"],
];

const sampleRanges = [
  "Tableau de bord!A1:M27",
  "Journal!A1:N12",
  "Categories!A1:E15",
  "Capital!A1:F12",
  "Stock!A1:I12",
  "Checks!A1:E6",
];

for (const range of sampleRanges) {
  await wb.render({ range, scale: 1, format: "png" });
}

const err = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  maxChars: 2000,
});
console.log(err.ndjson);

const output = await SpreadsheetFile.exportXlsx(wb);
await output.save(`${outputDir}/comptabilite_boutique_rosbri.xlsx`);
console.log(`${outputDir}/comptabilite_boutique_rosbri.xlsx`);
