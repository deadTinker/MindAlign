# MindAlign

MindAlign is a student-wellness application with option-based and text-based assessments, ML/NLP analysis, assessment summaries, a community space, and a practical wellness toolkit.

## Requirements

- Node.js 20.19+ (Node.js 22 LTS recommended)
- Python 3.11 recommended for the ML and NLP services
- MongoDB (local or hosted)
- Internet access for first-time NLP model downloads, if the model is not already cached

## Project services

| Service | Folder | Port | Start command |
|---|---|---:|---|
| NLP API | `Backend/NLP` | 5001 | `python nlp_api.py` |
| ML API | `Backend/ML` | 5002 | `python ml_api.py` |
| Node API | `Backend` | 5000 | `npm run dev` |
| React/Vite | `Frontend` | 5173 | `npm run dev` |

Keep each service running in its own terminal.

## 1. Configure the Node backend

```powershell
cd Backend
Copy-Item .env.example .env
```

Edit `Backend/.env` and set a valid `MONGO_URI` and a long, private `JWT_SECRET`. Add Cloudinary credentials only if you use profile-photo uploads. Never commit `.env` files or share their secrets.

Install and start:

```powershell
npm ci
npm run dev
```

The API listens on port 5000 after MongoDB connects.

## 2. Start the ML service

Open a second PowerShell window:

```powershell
cd Backend/ML
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python ml_api.py
```

Run `py -3.11 -m venv venv` only once. The ML API loads the existing `.joblib` models from `Backend/ML/models`; do not run the training scripts just to start the API. Start it from the `Backend/ML` directory so its relative model paths resolve.

## 3. Start the NLP service

Open a third PowerShell window:

```powershell
cd Backend/NLP
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python nlp_api.py
```

The first run may download pretrained model files and can take time. Keep this terminal open while using text-based assessment.

## 4. Start the frontend

Open a fourth PowerShell window:

```powershell
cd Frontend
Copy-Item .env.example .env
npm ci
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). The frontend API base is configurable through `VITE_API_URL`; the default is `http://localhost:5000/api`.

## 5. UX features and saved data

- The sidebar includes a light/dark appearance toggle. The preference is stored in this browser.
- The dashboard links daily check-ins to a short, non-diagnostic next-step suggestion.
- Assessment drafts are saved locally while a questionnaire is in progress and can be resumed in the same browser. Submitted assessments continue to use the existing backend API.
- Community articles can be bookmarked locally and filtered using the Saved control. Bookmarks are not synced across devices.
- The community composer explains that posts use the member's MindAlign profile name and reminds members not to publish identifying details.

## 6. Wellness Toolkit data

Daily check-ins, journal entries, workload items, and recovery-plan completion are stored in the current browser's local storage. They are not synced to MongoDB or across devices. Avoid using the journal on shared devices and do not enter highly sensitive information.

## 7. Troubleshooting

- **MongoDB connection failed:** verify `MONGO_URI`, network access, and that MongoDB is running.
- **ML model file not found:** run `python ml_api.py` from `Backend/ML`, not from the repository root.
- **NLP model download fails:** check internet access and available disk space, then retry; do not delete model caches unless necessary.
- **PowerShell blocks activation:** run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in that terminal, then activate the venv again.
- **Port already in use:** stop the other process using that port before starting the service.
- **Frontend cannot reach API:** confirm the Node backend is running and `Frontend/.env` points to the correct API base; restart Vite after changing `.env`.
- **Community moderation/reporting:** the current backend exposes article editing/deletion, likes and comments, but does not yet provide report-submission or moderator-review endpoints. Do not treat the community as actively moderated.

## 8. Notes

Assessment outputs are educational screening indicators, not medical diagnoses. The wellness toolkit is for self-reflection and planning, not treatment. Persistent or worsening distress warrants support from a qualified professional.
