import React, { useEffect, useState } from "react";
import axios from 'axios'
import { OverlayTrigger, Button, Popover } from "react-bootstrap";

export default function MultiNode() {

    const [Blocks, setBlocks] = useState({})
    const [Chains, setChains] = useState({})
    const [forkCount, setForkCount] = useState(0);

    useEffect(() => {
        updation();
    }, []);

    async function sleep() {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    async function getLatestBlocks() {
        await axios.post(`${process.env.REACT_APP_BACKEND}/v1/graphql`, {
            query: `
            {
                headentry(limit: 100, distinct_on: block_hash) {
                  typ
                  block_number
                  block {
                    created_at
                    difficulty
                    gas_limit
                    total_difficulty
                    gas_used
                    hash
                    miner
                    number
                    parent_hash
                    state_root
                    timestamp
                    transactions_count
                    transactions_root
                    uncles_count
                  }
                  headevent {
                    typ
                    node_id
                  }
                }
              }`,
          })
          .then(async (response) => {
            let arr = response.data.data.headentry
            var chains = Chains
            for (var i=0; i<arr.length; i++){
                if(Object.keys(chains).length === 0){
                    var singleChain = {
                        lastHash : '',
                        blocks : {}
                    }
                    singleChain.blocks[arr[i].block_number] = arr[i].block
                    singleChain.lastHash = arr[i].block.hash
                    chains[Object.keys(chains).length] = singleChain
                }else{
                    var chainsArray = Object.keys(chains)
                    for(var j=0; j<chainsArray.length; j++){
                        if(arr[i].block){
                            if(arr[i].block.parent_hash===chainsArray[j].lastHash){
                                chains[j].blocks.push(arr[i].block)
                                chains[j].lastHash = arr[i].block.lastHash
                            }
                        } 
                    }
                }
            }
            console.log(chains)          
            console.log(arr)
          })
          await sleep()
          await getLatestBlocks()
    }

    const updation = async () => {
        await getLatestBlocks()
        
    }
    
    return (
        <div>
            <center>
                <div style={{marginTop:'100px'}}>
                    <div style={{display: 'inline-block', flexDirection: 'column', textAlign: 'center'}}>
                        <h4>Got Last Blocks</h4>
                        <h5>{Object.values(Blocks).length}</h5>
                    </div>
                    <div style={{display: 'inline-block', flexDirection: 'column', marginLeft: '30px', textAlign: 'center'}}>
                        <h4>Forks</h4>
                        <h5>{forkCount}</h5>
                    </div>
                </div>
            </center>

            <center>
                <div style={{marginTop:'100px'}}>
                    {/* {renderData()} */}
                </div>
            </center>
        </div>
    );
}
