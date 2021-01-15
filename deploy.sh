#!/bin/sh
command="scp -i $TODO_EC_PEM_PATH -r ./dist $TODO_EC_USER@$TODO_EC_URL:/home/$TODO_EC_USER/todo/"

$command