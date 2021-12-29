// const { Gitgraph } = require("@gitgraph/react");
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Button, Popover } from "react-bootstrap";
import ChainData from '../data/chaindata.json';

export default function ForkGitGraph() {

    const [chaindata, setChaindata] = useState(ChainData);
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [forkCount, setForkCount] = useState(0);

    useEffect(() => {
        updation();
    }, []);

    useEffect(() => {
        var d = [...data];
        if(chaindata[count] !== null) {
            d.unshift(chaindata[count]);    // unshift() function inserts new element at the start
            
            if(chaindata[count-1] && chaindata[count-1].number === chaindata[count].number) {
                    setForkCount(forkCount+1)
            }
        }
        setData(d);
    }, [count]);

    async function sleep() {
        console.log("sleep start");
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("sleep done");
    }

    const updation = async () => {
        for (let i = 0; i < chaindata.length; i++) {
            setCount(i);
            await sleep();
            
        }
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
                        <strong>Parent Hash : </strong>{block.parentHash}
                    </li>
                    <li>
                        <strong>Miner : </strong>{block.miner}
                    </li>
                    <li>
                        <strong>Total Difficulty : </strong>{block.totalDifficulty}
                    </li>
                </ul>
            </Popover.Body>
            </Popover>
        )
    }

    const renderFork = (key) => {
        if( data[key-1] && data[key-1].number === data[key].number) {
            return (
                <span>
                    <OverlayTrigger placement="right" overlay={popover(data[key])}>
                        <Button className="m-2" variant="secondary">
                            <span>{data[key].hash.substring(0,10)}...</span><br></br>
                            <span>{data[key].parentHash.substring(0,10)}...</span>
                        </Button>
                    </OverlayTrigger>
                </span>
            )
        }
        else
            return (
                <span>
                    <br></br>
                    <span>#{data[key].number}</span>
                    <span>
                    <OverlayTrigger placement="right" overlay={popover(data[key])}>
                        <Button className="m-2" variant="secondary">
                            <span>{data[key].hash.substring(0,10)}...</span><br></br>
                            <span>{data[key].parentHash.substring(0,10)}...</span>
                        </Button>
                    </OverlayTrigger>
                    </span>
                </span>
            )
    }

    const renderData = () => {
        return data.map((block, key) => {
            return (
                <span>
                    {/* {console.log("Key: ", key, " Count: ", count)} */}
                    {renderFork(key)}
                </span>
            )
        })
    }

    return (
        <div>
            
            <div style={{display: 'flex'}}>
                <div style={{display: 'flex', flexDirection: 'column', textAlign: 'center'}}>
                    <h4>Blocks</h4>
                    <h5>{count+1}</h5>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', marginLeft: '30px', textAlign: 'center'}}>
                    <h4>Forks</h4>
                    <h5>{forkCount}</h5>
                </div>
            </div>
            {renderData()}
        </div>
    );
}