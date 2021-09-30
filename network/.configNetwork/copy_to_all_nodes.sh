#!/bin/sh

NUM=100;
echo "Copying file to all nodes"

FILE="../mrc.json" # path of genesis block

FILE_STATIC_NODES = "../.configNetwork/static-nodes.json" # path of genesis block


for ((i = 1; i <= $NUM; i++)); do
    
    cd "node$i" 
    
    # save  genesis block for all nodes 
    # cp "$FILE" "mrc.json" # copy mrc.json - genesis block for all nodes
    # cd ..
    # 'c:\Program Files\Geth\geth.exe' --datadir "node$i" init mrc.json # init genesis block to all nodes
    
    # save static-nodes file for all nodes
    cp "$FILE_STATIC_NODES" "static-nodes.json" # copy static-nodes.json - nodes list for all nodes
    cd .. 

done 

echo "DONE!!!"