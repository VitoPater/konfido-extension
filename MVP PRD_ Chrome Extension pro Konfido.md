# **MVP PRD: Chrome Extension pro Konfido**

## **1\. Přehled projektu**

Tento dokument definuje Minimální životaschopný produkt (MVP) pro rozšíření prohlížeče Chrome, které slouží jako most mezi externími právními zdroji a platformou Confido. Cílem MVP je ověřit základní hypotézu: *"Právníci chtějí rychle odesílat nalezené judikáty do své báze bez manuálního kopírování."*

## **2\. Cíle MVP**

* Umožnit odeslání textového obsahu z libovolné webové stránky do konkrétního projektu v Confidu.  
* Minimalizovat počet kliknutí potřebných k uložení dokumentu.  
* Poskytnout okamžitou zpětnou vazbu o úspěšném uložení.

## **3\. Funkční specifikace MVP**

### **3.1. Autentizace a nastavení**

* Uživatel se přihlásí do rozšíření pomocí svého API klíče nebo přihlašovacích údajů k Confidu.  
* Rozšíření si pamatuje vybraný "Aktivní projekt", do kterého se budou data ukládat.

### **3.2. Sběr dat (Scraping)**

| Metoda | Popis pro MVP   |
| :---- | :---- |
| **Odeslat celou stránku** | Tlačítko v popupu rozšíření, které vezme veškerý viditelný text a pošle ho jako nový dokument. |
| **Odeslat výběr** | Uživatel označí text, klikne pravým tlačítkem a zvolí "Poslat do Confida". |

### **3.3. Integrace s Confido API**

* Rozšíření volá endpoint /upload/text na backendu Confida.  
* Metadata obsahují: URL zdroje, titulek stránky a čas uložení.

### **3.4. Zpětná vazba**

* Zobrazení jednoduché "Toast" notifikace: *"Uloženo do projektu: \[Název projektu\]"*.

## **4\. Uživatelské workflow (Zjednodušené)**

1. Uživatel nainstaluje rozšíření a přihlásí se.  
2. V popupu na liště vybere projekt, na kterém právě pracuje.  
3. Na stránce s judikátem (např. v systému "bag") klikne na ikonu rozšíření a potvrdí odeslání.  
4. Dostane potvrzení o nahrání.

## **5\. Co NENÍ součástí MVP (Out of Scope)**

* Automatické zvýrazňování relevantních pasáží (Varianta 3 z diskuse).  
* Pokročilé formátování dokumentů před odesláním.  
* Správa více uživatelských účtů v jednom rozšíření.  
* Chat s Confidem přímo v okně rozšíření.

## **6\. Technické požadavky**

* **Manifest:** V3  
* **Oprávnění:** activeTab, contextMenus, storage.  
* **Backend:** Funkční API endpoint pro příjem prostého textu.

*Poznámka: Tento dokument se zaměřuje na rychlou realizaci a otestování základní funkce sběru dat.*