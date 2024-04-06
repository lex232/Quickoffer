#!/bin/bash
gnome-terminal --tab --title="backend" \
--command="bash -c 'cd ~/dev/quickoffer/backend/; source venv/bin/activate; python3 manage.py runserver; $SHELL'"
sleep 3s
gnome-terminal --tab --title="frontend" \
--command="bash -c 'cd ~/dev/quickoffer/frontend/; npm start; $SHELL'"
