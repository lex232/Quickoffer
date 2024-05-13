echo "backend & frontend quickoffer win"
start /min cmd /k "c: & cd dev\quickoffer\backend & venv\Scripts\activate & python manage.py runserver"
timeout /t 2
cmd /k "c: & cd dev\quickoffer\frontend & npm start"