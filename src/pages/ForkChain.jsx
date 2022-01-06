// const { Gitgraph } = require("@gitgraph/react");
import React, { useEffect, useState } from "react";
import axios from 'axios'
import { OverlayTrigger, Button, Popover } from "react-bootstrap";

export default function ForkGitGraph() {

    // const [chaindata, setChaindata] = useState([]);
    const [Blocks, setBlocks] = useState({})
    // const [data, setData] = useState([]);
    // const [count, setCount] = useState(0);
    const [forkCount, setForkCount] = useState(0);

    useEffect(() => {
        updation();
    }, []);

    // useEffect(() => {
    //     console.log("HAHA",Blocks)
    // }, [Blocks])

    async function sleep() {
        // console.log("sleep start");
        await new Promise(resolve => setTimeout(resolve, 1000));
        // console.log("sleep done");
    }

    async function getLatestBlocks() {
        await axios.post(`http://localhost:8080/v1/graphql`, {
            query: `
            {
                headentry(limit: 100, order_by: {block_number: desc}) {
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
                  }
                }
              }`,
          })
          .then(async (response) => {
            let arr = response.data.data.headentry
            // console.log(arr)
            var blocks = {}
            let forks = forkCount
            for (var i=0; i<arr.length; i++){
                    if(arr[i].block){
                        arr[i].block.typ = arr[i].headevent.typ
                    
                    if(blocks[arr[i].block_number]===undefined && arr[i].typ==='add'){
                        var obj = {}
                        obj.number = arr[i].block_number
                        obj.blocks= []
                        obj.removedBlocks = []
                        obj.blocks.push(arr[i].block)
                        blocks[arr[i].block_number] = obj
                    }
                    else if(blocks[arr[i].block_number]!==undefined && arr[i].typ==='add'){
                        blocks[arr[i].block_number].blocks.push(arr[i].block)
                        forks+=1
                    }
                    else if(blocks[arr[i].block_number]!==undefined && arr[i].typ==='del'){
                        blocks[arr[i].block_number].removedBlocks.push(arr[i].block)
                    }
                }
            }
            setForkCount(forks)

            setBlocks(blocks)
          })
          await sleep()
          await getLatestBlocks()
    }

    const updation = async () => {
        await getLatestBlocks()
        
    }
    

    const popover = (block) => {
        return (
            <Popover id="popover-basic">
            <Popover.Header as="h3">#{block.number}</Popover.Header>
            <Popover.Body>
                <ul>
                    <li>
                        <strong>Hash : </strong>{block.hash}<br></br>
                    </li>
                    <li>
                        <strong>Parent Hash : </strong>{block.parent_hash}
                    </li>
                    <li>
                        <strong>Miner : </strong>{block.miner}
                    </li>
                    <li>
                        <strong>Total Difficulty : </strong>{block.total_difficulty}
                    </li>
                </ul>
            </Popover.Body>
            </Popover>
        )
    }

    const isCanonical = (blockHash, removedBlocks) =>{
        // console.log(removedBlocks)

        if(removedBlocks.length===0){
            return true
        }
        for(var i=0; i<removedBlocks.length; i++){
            if(removedBlocks[i].hash===blockHash){
                return false
            }
        }
        return true
    }

    const isFork = (block) =>{
        console.log(block.typ)
        if(block.typ==='fork'){
            return true
        }
        else{
            return false
        }
    }

    const getBorderColor = (block, removedBlocks) =>{
        if(isFork(block)){
            return 'yellow'
        }else{
            if(isCanonical(block.hash, removedBlocks)){
                return 'green'
            }
            else{
                return 'black'
            }
        }
    }

    const renderFork = (block) => {
        if(block.blocks.length>1){
            return(
                <>
                    {/* <b>Fork</b> <br/> */}
                    {block.blocks.map((block1) => {
                        return (
                            <>
                            <OverlayTrigger trigger="click" placement="right" overlay={popover(block1)}>
                                    <Button className="m-2" variant="secondary" 
                                    style={{
                                        // height:'200px', 
                                        border: `${getBorderColor(block1, block.removedBlocks)} solid 5px`
                                    }}>
                                        <span>{block1.number}</span><br></br>
                                        {block1.hash===undefined? '':<span>{block1.hash.substring(0,20)}...</span>}<br></br>
                                    </Button>
                            </OverlayTrigger>
                            </> 
                        )
                    })}
                <br/>
                </>)
            }
        
        else{
            return (
                <>
                <OverlayTrigger trigger="click" placement="right" overlay={popover(block.blocks[0])}>
                        <Button className="m-2" variant="secondary" 
                        style={{
                            width:'400px', 
                            border: `${getBorderColor(block.blocks[0], block.removedBlocks)} solid 5px`
                        }}>
                            <span>{block.number}</span><br></br>
                            {block.blocks[0].hash===undefined? '':<span>{block.blocks[0].hash.substring(0,20)}...</span>}<br></br>
                        </Button>
                </OverlayTrigger>
                <br/>
                </> 
            )

        }
    }

    const renderData = () => {
        var blocks=Object.values(Blocks).reverse();  
        return blocks.map((block, key) => {
            return (
                <span>
                    {/* {console.log("Key: ", key, " Count: ", count)} */}
                    {renderFork(block)}
                </span>
            )
        })
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
                    {renderData()}
                </div>
            </center>
        </div>
    );
}