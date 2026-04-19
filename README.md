# Konfido Chrome Extension

Chrome extension pro odesílání judikátů a textů z webu přímo do Konfida (e-mailem).

## Jak to funguje

```
Uživatel klikne
      ↓
Chrome Extension → POST /api/send → Vercel funkce → Gmail SMTP → email na vit.pater@gnj.cz
```

1. Uživatel označí text nebo klikne "Odeslat celou stránku"
2. Extension pošle obsah na Vercel API
3. Vercel funkce odešle e-mail přes Gmail SMTP

---

## Struktura projektu

```
extension/          Chrome Extension (načítá se do prohlížeče)
  manifest.json     Konfigurace extension (MV3)
  background.js     Service worker - context menu a volání API
  popup.html/js     Popup při kliknutí na ikonu extension
  icon128.png       Ikona

api/
  send.js           Vercel serverless funkce - odesílání e-mailů

package.json        Závislosti (nodemailer)
vercel.json         Konfigurace Vercelu
```

---

## Instalace a vývoj

### Požadavky

- Node.js 18+
- Účet na [Vercel](https://vercel.com)
- Gmail účet s App Password

### 1. Klonování repozitáře

```bash
git clone https://github.com/konfidocz/chrome_extension.git
cd chrome_extension
npm install
```

### 2. Nastavení Gmail App Password

1. Přihlas se na Google účet ze kterého se budou posílat e-maily
2. Jdi na: Správa účtu Google → Zabezpečení → Dvoufázové ověření → Hesla aplikací
3. Vytvoř nový App Password s názvem "Konfido"
4. Zkopíruj 16-místný kód (použiješ v dalším kroku)

### 3. Propojení s Vercelem přes GitHub

Nejjednodušší způsob — Vercel sleduje GitHub a deployuje automaticky při každém pushnutí.

1. Přihlas se na [vercel.com](https://vercel.com) a klikni **Add New Project**
2. Klikni **Import Git Repository** a vyber `konfidocz/chrome_extension`
3. Nastavení nechej výchozí, klikni **Deploy**
4. Vercel přiřadí URL ve tvaru `chrome-extension-xxx.vercel.app`

Od teď každý `git push` do `main` spustí automatický redeploy.

### 4. Nastavení credentials ve Vercelu

Po prvním deployi přejdi do **Vercel Dashboard → tvůj projekt → Settings → Environment Variables** a přidej:

| Klíč | Hodnota |
|------|---------|
| `GMAIL_USER` | Gmail adresa odesílatele (např. `vitpater0@gmail.com`) |
| `GMAIL_APP_PASSWORD` | 16-místný App Password z kroku 2 (bez mezer) |
| `RECIPIENT` | E-mail kam přicházejí dokumenty (např. `vit.pater@gnj.cz`) |

Po uložení env vars klikni **Redeploy** (nebo pushni prázdný commit), aby se nové hodnoty načetly:

```bash
git commit --allow-empty -m "Redeploy po nastavení env vars"
git push
```

### 5. Aktualizace URL v extension

V souboru `extension/background.js` na řádku 1 uprav URL na svůj Vercel deployment:

```js
const API_URL = "https://konfido-extension.vercel.app/api/send";
```

### 6. Načtení extension do Chrome

1. Otevři Chrome a přejdi na `chrome://extensions`
2. Zapni **Developer mode** (přepínač vpravo nahoře)
3. Klikni **Load unpacked**
4. Vyber složku `extension/` z tohoto repozitáře

---

## Použití

### Odeslat vybraný text
1. Označ text na libovolné stránce
2. Klikni pravým tlačítkem
3. Vyber **"Poslat do Konfida"**

### Odeslat celou stránku
1. Klikni na ikonu Konfido v liště prohlížeče
2. Klikni **"Odeslat celou stránku"**

V obou případech přijde e-mail s textem, URL zdroje, titulkem stránky a časem uložení.

---

## Publikování do Chrome Web Store

Pro distribuci kolegům bez nutnosti Developer mode:

1. Zaregistruj vývojářský účet na [Chrome Web Store](https://chrome.google.com/webstore/devconsole) (jednorázový poplatek $5)
2. Zabal složku `extension/` do `.zip`:
   ```bash
   cd extension && zip -r ../konfido-extension.zip .
   ```
3. Nahraj `.zip` do Chrome Web Store
4. Nastav viditelnost na **Unlisted** (instalují jen lidé s přímým odkazem)
5. Po schválení (1-3 dny) rozešli odkaz kolegům

---

## Náklady

| Komponenta | Cena |
|-----------|------|
| Chrome Extension | zdarma |
| Vercel (Hobby tier) | zdarma (100k volání/měsíc) |
| Gmail SMTP | zdarma |
| Chrome Web Store | $5 jednorázově |

Provoz je prakticky zdarma pro desítky uživatelů.
