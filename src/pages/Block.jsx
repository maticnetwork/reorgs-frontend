import React, { useEffect, useState }from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function Block() {

    const [Block, setBlock] = useState({})
    const [HeadNodes, setHeadNodes] = useState([])
    const [ReorgNodes, setReorgNodes] = useState([])
    const { blockHash } = useParams()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async() =>{
        var headNodes = []
        var reorgNodes = []
        await axios.post(`http://localhost:8080/v1/graphql`, {
            query: `
            query MyQuery {
                headentry(where: {block_hash: {_eq: "${blockHash}"}, headevent: {typ: {_eq: "reorg"}}, typ: {_eq: "add"}}) {
                  typ
                  headevent {
                    typ
                    node_id
                  }
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
                }
              }
              `,
          })
          .then(async (response) => {
              var res = response.data.data.headentry
              for(var i=0; i<res.length; i++){

                  reorgNodes.push(res[i].headevent.node_id)
              }
              console.log('REORG NODES : ', reorgNodes)
              setReorgNodes(reorgNodes)

              await axios.post(`http://localhost:8080/v1/graphql`, {
                query: `
                query MyQuery {
                    headentry(where: {block_hash: {_eq: "${blockHash}"}, typ: {_eq: "add"}, headevent: {typ: {_eq: "head"}}}) {
                    typ
                    headevent {
                        typ
                        node_id
                    }
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
                    }
                }
                `,
            })
            .then(async (response2) => {
                var res2 = response2.data.data.headentry
                var block = res2[0].block
                setBlock(block)
                for(var i=0; i<res2.length; i++){
                    if(reorgNodes.indexOf(res2[i].headevent.node_id)===-1){
                        headNodes.push(res2[i].headevent.node_id)
                    }
                }
                console.log('HEAD NODES : ', headNodes)
                setHeadNodes(headNodes)
            })
             

          })
    }

    const renderNodes =(nodes)=>{
        return(
            <>
            {nodes.map(node=>(
                <>
                {node} <br/>
                </>
            ))}
            </>
        )
    }

    return (
        <div style={{backgroundColor:'bisque', paddingTop:'100px', paddingBottom:'100px'}}>
            {/* <div style={{maxWidth:'100%', wordBreak:'break-all'}}>
                {JSON.stringify(Block)}
            </div> */}
            <center>

                <h4>
                    Block Hash : {Block.hash}
                </h4>
                <br/><br/>
                <h4>
                    Block Number : {Block.number}
                </h4>
                <br/><br/>
                
            </center>
            <table style={{marginInline:'auto'}}>
                <tbody>
                
                {Object.keys(Block).map((property,key)=>(
                    <>
                    <tr key={key}>
                        <td><b>{property}</b></td><td>&nbsp;&nbsp;&nbsp;::&nbsp;&nbsp;&nbsp;</td><td>{Block[property]}</td>
                    </tr>
                    </>
                ))}

                <hr/>
                <tr>
                        <td><b>Head Nodes</b></td><td>&nbsp;&nbsp;&nbsp;::&nbsp;&nbsp;&nbsp;</td><td>{renderNodes(HeadNodes)}</td>
                </tr>

                <hr/>
                <tr>
                        <td><b>Reorg Nodes</b></td><td>&nbsp;&nbsp;&nbsp;::&nbsp;&nbsp;&nbsp;</td>
                        <td>
                            {ReorgNodes.length>0? renderNodes(ReorgNodes):'NA'}
                        </td>
                </tr>
                </tbody>
            </table>
            
        </div>
    )
}
