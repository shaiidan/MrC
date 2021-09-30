#!/bin/sh

NUM=100;
echo "create $NUM nodes"

for ((i = 1; i <= $NUM; i++)); do
    mkdir "node$i" # create a folder
    cd "node$i" 
    printf "123456" > password.txt # save the password on the node folder
    cd .. 
    'c:\Program Files\Geth\geth.exe' --datadir  "node$i" account new --password ./"node$i"/password.txt | tee pk.txt   # create node
    
    # save node public key to accounts file
    echo "node$i=" >> accounts.txt 
    echo $(awk 'NR==4' ./pk.txt) >> accounts.txt
    echo "" >> accounts.txt
done 