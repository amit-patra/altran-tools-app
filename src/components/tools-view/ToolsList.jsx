import React, { Component } from 'react';
import axios from 'axios';
class ToolsList extends Component {
    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
        this.search = this.search.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
        this.state = {
            error: null,
            isLoaded: false,
            imageLoadError: true,
            ToolsItem: [],
            serachData: "",
            ToolsName: [],
            ToolsList: [],
            AllToolsActivities:{}
        }

    }
    componentDidMount() {
        this.LoadToolsActivities();
    }
    LoadToolsActivities(){
        axios.get(`http://localhost:9000/allToolsActivities`)
        .then(res => {
            // console.log(res.data);
            this.state.AllToolsActivities = res.data;
        })
        .catch((error) => {

        });
    }
    goBack() {
        this.props.history.push("/");
    }
    searchHandler = (e) => {
        this.state.ToolsName = [];
        this.state.ToolsList = [];
        this.setState({ [e.target.name]: e.target.value, ToolsItem: [] })
    }
    search = (e) => {
        if (this.state.serachData) {
            this.state.ToolsName = [];
            this.state.ToolsList = [];
            let projectId = this.state.serachData;
            axios.get(`http://localhost:9000/viewTools/${projectId}`)
                .then(res => {
                    // console.log(res.data);
                    let toolsResponseData = res.data;
                    this.setState({
                        isLoaded: true,
                        ToolsItem: toolsResponseData
                    });
                })
                .catch((error) => {

                    this.setState({
                        isLoaded: false,
                        ToolsItem: []
                    });
                });
        }
        else {
            alert("Please enter projectId");
        }
        e.preventDefault();
    }


    checkImage(urlToFile) {
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', urlToFile, false);
        xhr.send();

        if (xhr.status == "404") {
            console.log("File doesn't exist");
            return false;
        } else {
            console.log("File exists");
            return true;
        }
    }
    getFileName(key, fileName) {
        var data = require('./tools.json');
        if (data[key].indexOf(fileName) >= 0) {
            return fileName
        }
        else {
            return "defaultImage";
        }
    }
    getActivities(ToolsHeader){
        let projectId = this.state.serachData;
        let AllToolsActivities = this.state.AllToolsActivities ;
        var ToolsStr = '';
        for (var key in AllToolsActivities) {
            if(key == projectId){
              let ToolsData =   AllToolsActivities[key];
                if(ToolsData[ToolsHeader]){
                    let AllToolKeyList = ToolsData[ToolsHeader]
                    for(var toolKey in AllToolKeyList){
                        let toolsItem = AllToolKeyList[toolKey];
                         ToolsStr += `<p className="flip-text">${toolKey}: ${toolsItem} </p>`
                    }
                }
            }
        }
        return  ToolsStr;
    }
    getImage(ToolsHeader,fileName){
        var str = "";
        var imagePath = "";
        var checkExistFile;
        if(ToolsHeader != "UnitTest"){
            checkExistFile =  this.getFileName(ToolsHeader, fileName)
            imagePath = require(`../../assets/icon/${checkExistFile}.png`);
            str = <img className="tool-img-icon" src={require(`../../assets/icon/${checkExistFile}.png`)} />
            return str;
        }
        else{
            if(fileName.length >0){
               let multipleImage = fileName.map((imgElement,index) =>
                (
                    <div key={index}>
                          <img className="multiple-tool-img-icon"  src={require(`../../assets/icon/${ this.getFileName(ToolsHeader, imgElement)}.png`)} />
                    </div>
                  
               ))
               return multipleImage
            }
           
        }
        
    }
    getToolData(ToolsHeader, ToolDetails) {
        let checkExistFile;
        for (var key in ToolDetails) {
            if (key == `${ToolsHeader}Tools`) {
                let fileName = ToolDetails[key];
                if(ToolsHeader != "UnitTest"){
                     checkExistFile = this.getFileName(ToolsHeader, fileName);
                }
                else{
                     checkExistFile = fileName;
                }

                return (
                    <React.Fragment>
                        <div className="flip-card">
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    {this.getImage(ToolsHeader,checkExistFile)}
                                </div>
                                <div className="flip-card-back">
                                    <div dangerouslySetInnerHTML={{ __html: this.getActivities(ToolsHeader)}} />
                                </div>
                            </div>
                        </div>
                    </React.Fragment>

                )
            }
        }
        // return Data
    }
    existingTechnology(techData){
        if(techData && techData.length>0){
          return(
            <div className="container technology-panel">
            <h3 style={{marginTop:'4px'}}>Technologies</h3>
            <hr className="technology-line" />
            <div className="row tech-skill">
                {this.getTechnology(techData)}
        </div>
        </div> 
          )  
        }
        else{
            return null;
        }
       
    }
    getTechnology(technologyData){
        if(technologyData && technologyData.length>0){
            let techData = technologyData.map((element,index)=>
            (
                <div className="col-md-4" key={index}>
                        <label style={{textTransform:"capitalize"}}>{element.technologyName}: </label> <span>{element.technologyData}</span>
                    </div>
            ) )
            return techData
        }
    }
    ScrollLeft() {
        var elmnt = document.getElementById("Tools-list-bar");
        elmnt.scrollLeft += 50;
    }
    ScrollRight() {
        var elmnt = document.getElementById("Tools-list-bar");
        elmnt.scrollLeft -= 50;
    }

    render() {
        const { error, isLoaded, ToolsItem, serachData } = this.state;
        let ToolsHeader, ToolsDetails, checkStatus;
        if (ToolsItem.length == 0) {
            return (
                <React.Fragment>
                    <form className="example" style={{ margin: 'auto', maxWidth: '300px', marginTop: '5px' }}>
                        <input type="text" placeholder="Search.." name="serachData" value={serachData} onChange={this.searchHandler} />
                        <button type="submit" onClick={this.search}><i className="fa fa-search"></i></button>
                    </form>
                    <h1>No data</h1>
                    <div>
                        <button className="btn btn-danger" onClick={this.goBack}>Back</button>
                    </div>
                </React.Fragment>
            )
        }
        else if (ToolsItem) {
            if (Object.values(this.state.ToolsItem).length > 0) {
                let objLength = Object.values(this.state.ToolsItem).length
                for (let i = 0; i < objLength; i++) {
                    let ToolsName = Object.keys(this.state.ToolsItem)[i];
                    if( ToolsName!="technology"){
                        ToolsName = ToolsName.split("Tools")[0];
                        this.state.ToolsName.push(ToolsName);
                    }
                  

                }
            }


            var self = ToolsItem;
            ToolsDetails = this.state.ToolsName.map((ToolsHeader, index) => {
                return (
                    <div className="tools-panel" key={index}>
                        <p className="tool-name">{ToolsHeader}</p>
                        <hr className="line" />
                        <div>
                            {this.getToolData(ToolsHeader, self)}
                        </div>
                    </div>
                )

            })
        }
        return (
            <React.Fragment>
                <form className="example" style={{ margin: 'auto', maxWidth: '300px', marginTop: '5px' }}>
                    <input type="text" placeholder="Search.." name="serachData" value={serachData} onChange={this.searchHandler} />
                    <button type="submit" onClick={this.search}><i className="fa fa-search"></i></button>
                </form>
                {this.existingTechnology(ToolsItem.technology)}
                <div className="container" style={{ marginTop: "10px" }} >

                    {/* Start New JSX */}
                    <div className="row tool-list-area">
                        <div className="col-md-1 padding-0 col-md-1point5" >
                            <button className="pull-left arrow-btn" onClick={this.ScrollRight}>
                                <i className="fa fa-angle-double-left"></i>
                            </button>
                        </div>
                        <div className="col-md-10 padding-0 col-md-10point5 padding-left20" >
                            <div id="Tools-list-bar">
                                <div id="content">
                                    {ToolsDetails}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-1 padding-0 col-md-2point5" >
                            <button className="pull-right arrow-btn" onClick={this.ScrollLeft}><i className="fa fa-angle-double-right"></i></button>
                        </div>
                    </div>
                    {/* End New JSX */}
                </div>
                <div>
                    <button className="btn btn-danger" onClick={this.goBack}>Back</button>
                </div>

            </React.Fragment>

        )
    }
}
export default ToolsList