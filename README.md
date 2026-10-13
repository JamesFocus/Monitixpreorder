# Montiix Watch – Preorder Shop

A complete **Node.js** preorder shop page for the Montiix limited watch collection (Horizon & Apex).

- Modern dark luxury UI
- Live remaining-units counter (max 500)
- Preorder form → saved to local JSON
- Fully responsive
- No external database required

---

## Requirements

- **Node.js 18+**
- npm (comes with Node)

---

## Quick start

```bash
# 1. Unzip the project
unzip montiix-preorder-shop.zip
cd montiix-preorder-shop

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

Open your browser:

```
http://localhost:3000
```

That’s it.

---

## Development (auto-restart on file change)

```bash
npm run dev
```

---

## Project structure

```
montiix-preorder-shop/
├── server.js              # Express server + preorder API
├── package.json
├── data/
│   └── preorders.json     # Created automatically – stores all preorders
├── public/
│   ├── index.html         # Shop page
│   ├── css/styles.css
│   └── js/app.js
└── README.md
```

---

## API endpoints

| Method | Path            | Description                          |
|--------|-----------------|--------------------------------------|
| GET    | `/api/stats`    | `{ total, remaining, limit }`        |
| POST   | `/api/preorder` | Submit a preorder (JSON body)        |

### Example preorder body

```json
{
  "name": "Alex Morgan",
  "email": "alex@email.com",
  "phone": "+1 555 000 0000",
  "model": "Horizon",
  "size": "42mm",
  "quantity": 1,
  "notes": "Gift wrapping please"
}
```

---

## Viewing preorders

All submissions are saved in:

```
data/preorders.json
```

You can open this file in any text editor or import it into a spreadsheet.

---

## Changing the port

```bash
PORT=8080 npm start
```

Or create a `.env` file:

```
PORT=8080
```

---

## Optional: connect PayPal deposit later

This shop currently collects preorders **without payment**.  
When you are ready to take deposits, you can drop in the reusable PayPal module and call it from the form success handler.

---

## License

MIT – free to use and modify for your projects.
