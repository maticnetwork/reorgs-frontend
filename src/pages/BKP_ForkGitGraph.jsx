// const { Gitgraph } = require("@gitgraph/react");
import { GitgraphCore, GitgraphUserApi } from '@gitgraph/core';
import { Gitgraph } from '@gitgraph/react';
import React, { useEffect, useState } from "react";
import ChainData from '../data/chaindata.json';

export default function ForkGitGraph() {

    const [chaindata, setChaindata] = useState(ChainData);
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [Content, setContent] = useState();
    const [G, setG] = useState();

    useEffect(() => {
        updation();
    }, []);

    useEffect(() => {
        console.log("length: ",data.length)
        var content = data.map((item, key) => {
            return (
                // <div>{item.number}</div>
                <Gitgraph>
                {(gitgraph) => {
                    // console.log("item: ", item.number)
                    // console.log("datalen: ", data.length)
                    // Simulate git commands with Gitgraph API.
                    // const master = gitgraph.branch("master");

                    // console.log("key: ",key)

                    
                    let j = key-1;
                    console.log("key: ",key)
                    console.log("data: ",data.length)
                    // while(j>=0) {
                        if( data[j] && data[j] == data[key]) {
                            console.log("HERE")
                            const fork = gitgraph.branch("fork");
                            fork.commit("Fork Block No. : "+ data[key].number);
                        }
                    // }
                    else
                        G.commit("Block No. : "+ data[key].number);
                    // data.forEach(element => {
                    //     master.commit("Block No. : "+ element.number);
                    // });
    
                    // const develop = master.branch("develop");
                    // develop.commit("Add TypeScript");
    
                    // const aFeature = develop.branch("a-feature");
                    // aFeature
                    // .commit("Make it work")
                    // .commit("Make it right")
                    // .commit("Make it fast");
    
                    // develop.merge(aFeature);
                    // develop.commit("Prepare v1");
    
                    // master.merge(develop).tag("v1.0.0");
                }}
                </Gitgraph>
            )
        })
        console.log("count: ", count)
        setContent(content);
        // console.log("d1: ", data.length);
        if(chaindata[count] !== null) {
            data.push(chaindata[count]);
        }
        console.log("d2: ", data[0]);
        var d = [...data];
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

    return (
        <div>
            
            {/* {data.length>0 && data[data.length-1].number} */}
            <Gitgraph>
                {(gitgraph) => {
                    const master = gitgraph.branch("master");
                    // master.commit("Initial commit");
                    setG(master);
                }}
            </Gitgraph>
            {Content}
        </div>
    );
}