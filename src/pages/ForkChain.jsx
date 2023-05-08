import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { OverlayTrigger, Button, Popover } from "react-bootstrap";

var canons = []
var nodeAdditions = []
var pause = false

export default function ForkGitGraph() {


    const [Blocks, setBlocks] = useState({})
    const [forkCount, setForkCount] = useState(0);
    const [offsetSetting, setOffsetSetting] = useState(0)

    const { apiKey } = useParams()

    var { offset } = useParams()
    if(offset===undefined || offset<0){
        offset=0
    }
    const { nodeid } = useParams()

    const _handlePauseKey = event => {
        console.log(event);
        if(event.key==='s'){
            pause = !pause
            if(pause){
                alert("Paused, Press s to resume!")
            }
        }
       
  }

    useEffect(() => {
        document.addEventListener("keydown" ,_handlePauseKey, false)
        updation();
        // alert("You can press 's' to pause/resume the surveillance!")
    }, []);

    async function sleep() {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    let config = {
        headers: {
            'x-hasura-admin-secret': apiKey,
            'content-type': 'application/json'
        }
    }

    async function getLatestBlocks() {
        if(!pause){
            await axios.post(`${process.env.REACT_APP_BACKEND}/v1/graphql`, {
            query: `
            {
                headentry( offset: ${offset}, where: {headevent: {node_id: {_eq: "${nodeid}"}}}, limit: 100, order_by: {block_number: desc}) {
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
          }, config)
          .then(async (response) => {
            let arr = response.data.data.headentry
            // console.log(arr)
            canons = []
            nodeAdditions = []
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

                        if(arr[i].headevent.typ==='head'){
                            nodeAdditions.push(arr[i].block.hash)
                        }
                    }                    
                    else if(blocks[arr[i].block_number]!==undefined && arr[i].typ==='add'){
                        
                        var blockArr = blocks[arr[i].block_number].blocks
                        var done = false

                        for(var j = 0; j<blockArr.length; j++){
                            if(arr[i].block.hash===blockArr[j].hash){
                                done = true
                                break
                            }
                        }
                        if(done!==true){
                            blocks[arr[i].block_number].blocks.push(arr[i].block)
                            blocks[arr[i].block_number].blocks.sort( compare );
                            forks+=1
                        }

                        if(arr[i].headevent.typ==='head'){
                            nodeAdditions.push(arr[i].block.hash)
                        }
                    }
                    else if(blocks[arr[i].block_number]!==undefined && arr[i].typ==='del'){
                        blocks[arr[i].block_number].removedBlocks.push(arr[i].block)
                    }
                }
            }

            var arr2 = Object.keys(blocks).reverse()
                var last_parent = 0
                for(i=0; i<arr2.length;i++){
                    if(i===0){
                        canons.push(blocks[arr2[i]].blocks[0].hash)
                        canons.push(blocks[arr2[i]].blocks[0].parent_hash)
                        last_parent = blocks[arr2[i]].blocks[0].parent_hash
                    }else{
                        // console.log(blocks[arr2[i]].blocks.length)
                        for(j=0; j<blocks[arr2[i]].blocks.length;j++){
                            if(last_parent===blocks[arr2[i]].blocks[j].hash){
                                canons.push(blocks[arr2[i]].blocks[j].parent_hash)
                                last_parent = blocks[arr2[i]].blocks[j].parent_hash
                                break
                            }
                        }
                    }
            }

            setForkCount(forks)
            setBlocks(blocks)
          })
        }
        
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

    function compare( a, b ) {
        // console.log(a)
        if ( a.total_difficulty > b.total_difficulty ){
          return -1;
        }
        if ( a.total_difficulty < b.total_difficulty ){
          return 1;
        }
        return 0;
      }

    const getBorderColor = (blockHash) =>{
        var index = canons.indexOf(blockHash)
        if(index===-1){
            var index2 = nodeAdditions.indexOf(blockHash)
            if(index2===-1){
                return 'yellow'
            }
            return 'black'
        }
        return 'green'
    }

    const renderFork = (block) => {
        if(block.blocks.length>1){
            return(
                <>
                    
                    {block.blocks.map((block1) => {
                        return (
                            <>
                                    <a href={"/block/"+block1.hash+"/"+apiKey} target='_blank' rel="noreferrer">
                                    <OverlayTrigger placement="right" overlay={popover(block1)}>
                                    <Button className="m-2" variant="secondary" 
                                    style={{
                                        width: `${getBorderColor(block1.hash)==='green'? 495:495/(block.blocks.length-1)- ((block.blocks.length-1)*5)}px`, 
                                        backgroundColor:'#FFE57C',
                                        color:'black',
                                        overflow:'hidden',
                                        border: `${getBorderColor(block1.hash)} solid 5px`
                                    }}>
                                        <span>{block1.number}</span><br></br>
                                        {block1.hash===undefined? '':<span>{block1.hash.substring(0,20)}...</span>}<br></br>
                                    </Button>
                                    </OverlayTrigger>
                                    </a>
                            </> 
                        )
                    })}
                <br/>
                </>)
            }
        
        else{
            return (
                <>
                        <a href={"/block/"+block.blocks[0].hash+"/"+apiKey} target='_blank' rel="noreferrer">
                        <OverlayTrigger placement="right" overlay={popover(block.blocks[0])}>
                        <Button className="m-2" variant="secondary" 
                        
                        style={{
                            width:'1000px', 
                            backgroundColor:'#FFE57C',
                            color:'black',
                            overflow:'hidden',
                            border: `${getBorderColor(block.blocks[0].hash)} solid 5px`
                        }}>
                            <span>{block.number}</span><br></br>
                            {block.blocks[0].hash===undefined? '':<span>{block.blocks[0].hash.substring(0,20)}...</span>}<br></br>
                        </Button>
                        </OverlayTrigger>
                        </a>
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
                    {renderFork(block)}
                </span>
            )
        })
    }

    return (
        <div style={{backgroundColor:'lightblue', paddingTop:'100px', paddingBottom:'100px'}}>
            <center>
                
                <div>
                    <u><h1 style={{marginRight:'300px'}}>Single Node Visualisation : {nodeid}</h1></u><br/><br/>
                    <div style={{display: 'inline-block', flexDirection: 'column', textAlign: 'center', marginRight:'300px'}}>
                        <h4>Got Last Blocks</h4>
                        <h5>{Object.values(Blocks).length}</h5>
                    </div>
                    <div style={{display: 'inline-block', flexDirection: 'column', marginLeft: '30px', textAlign: 'center', marginRight:'300px'}}>
                        <h4>Forks</h4>
                        <h5>{forkCount}</h5>
                    </div>
                    <br/><br/>

                    <div style={{display: 'inline-block', flexDirection: 'column', marginLeft: '30px', textAlign: 'center', marginRight:'300px'}}>
                        
                        <input
                            type='number'
                            onChange={(e)=>{setOffsetSetting(e.target.value)}}
                            style={{background:'transparent',
                                    borderColor:'#737373',
                                    borderStyle:'solid',
                                    borderWidth:'1px',
                                    height:'50px',
                                    width:'300px',
                                    borderRadius:'10px',
                                    paddingLeft:'15px', 
                                    paddingRight:'15px',
                                }}
                                placeholder='Offset'
                            >
                            </input>
                        
                        <br/><br/>
                        <a href={`/node/${nodeid}/${parseInt(offset)+parseInt(offsetSetting)}/${apiKey}`}><button>Add Offset</button></a>

                       
                        &nbsp;&nbsp;&nbsp;
                        <a href={`/node/${nodeid}/${parseInt(offset)-parseInt(offsetSetting)}/${apiKey}`}><button>Subtract Offset</button></a>
                    </div>
                </div>
                <br/>
            </center>

            <center>
                <div style={{marginTop:'100px', marginRight:'300px'}}>
                    {renderData()}
                </div>
            </center>
        </div>
    );
}
