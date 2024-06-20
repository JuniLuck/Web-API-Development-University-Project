import React from "react";

function WebTitle(body) {
    const text = "Books.com";
    return (<div>
        <h1 style={{color: "green",
                fontFamily: "Times-BoldItalic",
                fontSize: 60}}>
            {text}
        </h1>
        <h2 style={{fontFamily: "Arial",
                    fontSize: 30}}>
            {body.name}
        </h2>
    </div>);
}

export default WebTitle;