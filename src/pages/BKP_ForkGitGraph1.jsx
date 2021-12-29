import React, { Component } from "react";
import ChainData from '../data/chaindata.json';
import { Gitgraph } from '@gitgraph/react';

class ForkGitGraph1 extends Component {
    
    state = {
        chaindata: ChainData,
        data: []
    }

    componentWillMount() {
        // this.setState({chaindata: ChainData, data: ChainData});
        var i = 0;
        setInterval(() => {
            console.log("i: ",i)
            var d = [...this.state.data];
            if(this.state.chaindata[i]) {
                d.push(this.state.chaindata[i++]);
                var data2 = [...d];
                this.setState({data: data2});
            }
            // console.log("data:", data);
        }, 2000);
        
    }

    renderGitGraph = (data) => {
        console.log("Data: ", data.length);
        return (
            <Gitgraph>
                {(gitgraph) => {
                    const master = gitgraph.branch("master");
                    master.commit("Initial commit");

                    for (let i = 0; i < data.length; i++) {
                        // if(data[i])
                        // console.log("I: ", i);
                        master.commit("Block No. : "+ data[i].number);
                    }

                    // data.forEach(element => {
                    //     master.commit("Block No. : "+ element.number);
                    // });
                }}
            </Gitgraph>
        );
    }

    render() {
        const data = [...this.state.data];
        return (
            <div>
                Size: {data.length}
                {this.renderGitGraph(data)}
            </div>
        )
    }

}

export default ForkGitGraph1;