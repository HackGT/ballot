import * as React from 'react';
import roomData = require('../../data.json');

interface JudgingRoomProps {
    table: string;
}

// let styles = {
//     fill:none;stroke:#000000;stroke-width:3.14576221px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1
// }

class JudgingRoom extends React.Component<JudgingRoomProps, {}>{
    constructor(props: JudgingRoomProps) {
        super(props)
        console.log(roomData)
    }
    public render() {
        return (
            <svg width="817.33331" height="486.66666" viewBox="0 0 817.33331 486.66666">
                <path d={roomData.path} fill="none" stroke="#000000"/>
                // render n number of rectangles
                {roomData.tables.map(table => {
                    return <rect fill="#000000" key={table.id} x={table.x} y={table.y} width={table.width} height={table.height} className="table" id={table.id} transform={table.transform}/>
                })}
            </svg>
        )
    }

    public componentDidMount() {
        const tableNumber = this.props.table.split(" ")[1];
        console.log(tableNumber)
        const highlightTable = document.getElementById(tableNumber + "");
        if (! highlightTable) {
            console.log("null");
        } else {
            highlightTable.setAttribute("fill", "green")
        }
    }

    private disproomData() {
        console.log(roomData);
    }

}

export default JudgingRoom;
