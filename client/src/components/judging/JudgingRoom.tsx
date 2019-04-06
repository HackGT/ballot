import * as React from 'react'
import roomData = require('../../data.json')


interface JudgingRoomProps {
    table: string
}

class JudgingRoom extends React.Component<JudgingRoomProps>{
    constructor(props: JudgingRoomProps) {
        super(props);
    }
    public render() {
        const index = 0
        let tableId = 0;
        return (
            <div>
                <h1>{roomData[index].title}</h1>
                <svg style={{width: '90vw', height: '60vw'}} viewBox="0 0 817.33331 486.66666">
                    <path style={{fill: "none", stroke: `${this.props.table.split(" ")[0].toLowerCase()}`, strokeWidth: "3"}} d={roomData[index].path}/>
                    {
                        roomData[index].groups.map((group: any, i: any) => {
                            return (
                                <g key={i} transform={group.transform}>
                                {
                                    group.tables.map((table: any, j: any) => {
                                        tableId += 1
                                        return (
                                            <rect
                                                id={`${tableId}`}
                                                key={j}
                                                x={table.x}
                                                y={table.y}
                                                width={table.width}
                                                height={table.height}
                                                transform={table.transform}
                                                fill="grey"
                                                style={{stroke: "black", strokeWidth: "3"}}
                                            />
                                        )
                                    })
                                }
                                {
                                    group.paths.map((arrow: any, k: any) => {
                                        return (
                                            <path
                                                key={k}
                                                d={arrow.d}
                                                transform={arrow.transform}
                                            />
                                        )
                                    })
                                }
                                </g>
                            )
                        })
                    }
                </svg>
            </div>
        )
    }

    public componentDidMount() {
        const [tableColorRaw, tableNumber] = this.props.table.split(" ");
        const tableColor = tableColorRaw.toLowerCase();
        const highlightTable = document.getElementById(tableNumber + "");
        if (!highlightTable) {
            console.error("null");
        } else {
            highlightTable.setAttribute("fill", tableColor);
        }
    }
}

export default JudgingRoom;
