import React, { Component } from 'react';
import axios from 'axios';
class ToolsComponent extends Component {
    constructor(props) {
        super(props);
        this.selectHandler = this.selectHandler.bind(this);
        this.confirm = this.confirm.bind(this);
        this.addOtherData = this.addOtherData.bind(this);
        this.myOhtersHandler = this.myOhtersHandler.bind(this);
        this.projectIdHandler = this.projectIdHandler.bind(this);
        this.viewTools = this.viewTools.bind(this);
        this.showCheckboxes = this.showCheckboxes.bind(this);
        this.unitTestHandler = this.unitTestHandler.bind(this);
        this.technologyHandler = this.technologyHandler.bind(this);
        this.state = {
            fields: {},
            projectId: "",
            othersData: {},
            expanded: false,
            unitCheckedItem: [],
            technologiesData:{},
            ScmTools: [
                { ToolName: "Git", Value: "Git" },
                { ToolName: "GitHub", Value: "GitHub" },
                { ToolName: "BitBucket", Value: "BitBucket" },
                { ToolName: "GitLabs", Value: "GitLabs" },
                { ToolName: "Others", Value: "Others" },
            ],
            PmTools: [
                { ToolName: "JIRA", Value: "JIRA" },
                { ToolName: "Others", Value: "Others" },
            ],
            AgileMethodologyTools: [
                { ToolName: "Scrum", Value: "Scrum" },
                { ToolName: "KanBan", Value: "KanBan" },
                { ToolName: "Others", Value: "Others" },
            ],
            BuildServerTools: [
                { ToolName: "Jenkins", Value: "Jenkins" },
                { ToolName: "Bamboo", Value: "Bamboo" },
                { ToolName: "Travis", Value: "Travis" },
                { ToolName: "CircleCI", Value: "CircleCI" },
                { ToolName: "Gitrunner", Value: "Gitrunner" },
                { ToolName: "BuddyWorks", Value: "BuddyWorks" },
                { ToolName: "Others", Value: "Others" }
            ],
            UnitTestTools: [
                { ToolName: "NUnit", Value: "NUnit" },
                { ToolName: "Junit", Value: "Junit" },
                { ToolName: "Others", Value: "Others" },
            ],
            CodeCoverageTools: [
                { ToolName: "SonarQube", Value: "SonarQube" },
                { ToolName: "NewRelic", Value: "NewRelic" },
                { ToolName: "Others", Value: "Others" },
            ],
            BugTrackingTools: [
                { ToolName: "JIRA", Value: "JIRA" },
                { ToolName: "Bugzilla", Value: "Bugzilla" },
                { ToolName: "Others", Value: "Others" },
            ],
            ContinuousDeliveryTools: [
                { ToolName: "Docker", Value: "Docker" },
                { ToolName: "Kubernetes", Value: "Kubernetes" },
                { ToolName: "AWS", Value: "AWS" },
                { ToolName: "GCE", Value: "GCE" },
                { ToolName: "Azure", Value: "Azure" },
                { ToolName: "Others", Value: "Others" },
            ],
            ContinuousDeploymentTools: [
                { ToolName: "Artifactory", Value: "Artifactory" },
                { ToolName: "Nexus", Value: "Nexus" },
                { ToolName: "Others", Value: "Others" },
            ],
        }
    }

    selectHandler(event) {
        // console.log(event.target.name);
        // console.log(event.target.value);
        if (event.target.value == "Others") {
            let id = `${event.target.name}Input`
            let getInputId = document.getElementById(id);
            getInputId.style.display = "inline";
        }
        else {
            let id = `${event.target.name}Input`
            let getInputId = document.getElementById(id);
            getInputId.style.display = "none";
        }
        let fields = this.state.fields;
        fields[event.target.name] = event.target.value;
        this.setState({
            fields
        })
        event.preventDefault();
    }
    technologyHandler(event){
        
        // console.log(event.target.name);
        // console.log(event.target.value);
        let technologiesData = this.state.technologiesData;
        technologiesData[event.target.name] = event.target.value;
        this.setState({ 
            technologiesData
        })
    }
    addOtherData = (e) => {
        if (e.key === 'Enter') {
            // alert(`you have enter ${e.target.value}`);
            let inputId = e.target.id;
            let Tools = inputId.split("Input")[0];
            let addsection = this.state[Tools];
            let addJson = { ToolName: e.target.value, Value: e.target.value }
            let arrayData = this.insert(addsection, addJson, addsection.length - 1);
            this.state[Tools] = arrayData;
            // let finalData = this.state[Tools];
            let getInputId = document.getElementById(inputId);
            getInputId.style.display = "none";
            this.state.fields[Tools] = "";
            if (e.target.name == "UnitTestToolsInput") {
                var checkboxes = document.getElementById("checkboxes");
                var allCheckBox = document.getElementsByClassName("checkBox");
                checkboxes.style.display = "none";
                this.state.expanded = false;
                this.state.unitCheckedItem = [];
                for (let i = 0; i < allCheckBox.length; i++) {
                    allCheckBox[i].checked = false;
                }
            }
            this.setState({
                arrayData
            })

        }

    }
    insert(arr, val, index) {
        return index >= arr.length
            ? arr.concat(val)
            : arr.reduce((prev, x, i) => prev.concat(i === index ? [val, x] : x), []);
    }
    myOhtersHandler(event) {
        //   let OthersData = this.state.othersData.OthersScmData
        let othersData = this.state.othersData;
        othersData[event.target.name] = event.target.value;
        this.setState({
            othersData
        });
        event.preventDefault();
    }
    projectIdHandler(event) {
        this.setState({
            projectId: event.target.value
        });
    }
    setTechnology(technologiesData){
        this.state.fields["technology"]=[];
        let field = this.state.fields["technology"];
        for (var key in technologiesData) {
            let techData =   technologiesData[key];
            field.push({ 
                technologyName: key, 
                technologyData:  techData
            })
        }
        // console.log(this.state.fields);
    }
    confirm = (e) => {
        let technologiesData = this.setTechnology(this.state.technologiesData)
        if (this.checkWithObjValue(this.state.fields)) {
            // console.log(this.state.fields);
            let postJson = { projectId: this.state.projectId, selectedToolsList: this.state.fields }
            axios.post(`http://localhost:9000/createFile`, postJson)
                .then(res => {
                    // console.log(res.data);
                    alert("Successfully Completed");
                })
                .catch((error) => {
                    /* eslint-disable no-console */
                    // console.log(error);
                    /* eslint-enable no-console */
                });
        }
        e.preventDefault();

    }
    checkWithObjValue(objData) {
        let status = false;
        let length = Object.values(this.state.fields).length;
        for (let i = 0; i < length; i++) {
            let keyData = Object.values(this.state.fields)[i]
            if (keyData == "Others") {
                let value = Object.keys(this.state.fields)[i]
                console.error(`Please select ${value} `)
            }
            if (keyData == "") {
                status = false;
            }
            else {
                status = true;
            }
        }
        if (this.state.projectId) {
            status = true;
        }
        else {
            status = false;
            console.error(`Please enter project id`);
        }
        if (this.state.unitCheckedItem.length == 0) {
            status = false;
            console.error(`Please select UnitTest`)
        }
        else {
            this.state.fields["UnitTestTools"] = this.state.unitCheckedItem;
            status = true;
        }

        return status
    }
    viewTools() {
        this.props.history.push("/viewTools");
    }

    showCheckboxes() {
        var checkboxes = document.getElementById("checkboxes");
        if (!this.state.expanded) {
            checkboxes.style.display = "block";
            this.state.expanded = true;
        } else {
            checkboxes.style.display = "none";
            this.state.expanded = false;
        }
    }
    unitTestHandler(e) {
        let item = e.target.name;
        let isChecked = e.target.checked;
        let UnitTextBoxId = `UnitTestToolsInput`
        if (item == "Others" && isChecked) {
            // var checkboxes = document.getElementById("checkboxes");
            // checkboxes.style.display = "none";
            // this.state.expanded = false;
            let getInputId = document.getElementById(UnitTextBoxId);
            getInputId.style.display = "inline";
        }
        else {
            let getInputId = document.getElementById(UnitTextBoxId);
            getInputId.style.display = "none";
        }
        if (item != "Others" && isChecked) {
            if (this.state.unitCheckedItem.indexOf(item) < 0) {
                this.state.unitCheckedItem.push(item)
            }
        }
        else if (item != "Others" && !isChecked) {
            var CheckedIndex = this.state.unitCheckedItem.indexOf(item);
            if (CheckedIndex >= 0) {
                this.state.unitCheckedItem.splice(CheckedIndex, 1);
            }
        }
    }
    render() {
        let ScmToolsOptions = this.state.ScmTools.map((element, index) => (
            <option value={element.value} key={index}>{element.ToolName}</option>
        ))
        let PmToolsOptions = this.state.PmTools.map((element, index) => (
            <option value={element.value} key={index}>{element.ToolName}</option>
        ))
        let AgileMethodologyToolsOptions = this.state.AgileMethodologyTools.map((element, index) => (
            <option value={element.value} key={index}>{element.ToolName}</option>
        ))
        let BuildServerToolsOptions = this.state.BuildServerTools.map((element, index) => (
            <option value={element.value} key={index}>{element.ToolName}</option>
        ))
        let UnitTestToolsOptions = this.state.UnitTestTools.map((element, index) => (
            // <option value={element.value} key={index}>{element.ToolName}</option>
            <p key={index}>
                <input type="checkbox" className="checkBox" name={element.ToolName} onChange={this.unitTestHandler} />{element.ToolName}
            </p>
        ))
        let CodeCoverageToolsOptions = this.state.CodeCoverageTools.map((element, index) => (
            <option value={element.value} key={index}>{element.ToolName}</option>
        ))
        let BugTrackingToolsOptions = this.state.BugTrackingTools.map((element, index) => (
            <option value={element.value} key={index}>{element.ToolName}</option>
        ))
        let ContinuousDeliveryToolsOptions = this.state.ContinuousDeliveryTools.map((element, index) => (
            <option value={element.value} key={index}>{element.ToolName}</option>
        ))
        let ContinuousDeploymentToolsOptions = this.state.ContinuousDeploymentTools.map((element, index) => (
            <option value={element.value} key={index}>{element.ToolName}</option>
        ))
        return (
            <React.Fragment>
                <h1>Tools List</h1>
                <button className="btn btn-success" onClick={this.viewTools}>View</button>
                <form>
                    <div className="login">
                        <div>
                            <label className="label-pos"> Project Id:</label>
                            <input type="text" className="input-field drop-down" name="ProjectIdInput" placeholder="Please enter projectId" value={this.state.projectId || ''} onChange={this.projectIdHandler} />
                        </div>
                        <div>
                            <label className="label-pos"> Languages:</label>
                            <textarea type="text" className="input-field drop-down" name="languages" placeholder="Please enter Languages" value={this.state.technologiesData.languages || ''} onChange={this.technologyHandler} />
                        </div>
                        <div>
                            <label className="label-pos"> Frameworks:</label>
                            <textarea type="text" className="input-field drop-down" name="frameworks" placeholder="Please enter frameworks" value={this.state.technologiesData.frameworks || ''}  onChange={this.technologyHandler} />
                        </div>
                        <div>
                            <label className="label-pos"> Architecture:</label>
                            <textarea type="text" className="input-field drop-down" name="architecture" placeholder="Please enter architecture" value={this.state.technologiesData.architecture || ''}  onChange={this.technologyHandler} />
                        </div>
                        <div>
                            <label className="label-pos">Scm Tools</label>
                            <select className="input-field drop-down drop-down" name="ScmTools" value={this.state.fields.ScmTools || ''} onChange={this.selectHandler}>
                                <option >Please Select</option>
                                {ScmToolsOptions}
                            </select>
                            <input type="text" className="input-field drop-down" id="ScmToolsInput" name="ScmToolsInput" placeholder="Please enter ScmTools name" style={{ display: 'none' }} value={this.state.othersData.ScmToolsInput || ''} onChange={this.myOhtersHandler} onKeyDown={this.addOtherData} />
                        </div>
                        <div>
                            <label className="label-pos">Pm Tools</label>
                            <select className="input-field drop-down drop-down" name="PmTools" value={this.state.fields.PmTools || ''} onChange={this.selectHandler}>
                                <option >Please Select</option>
                                {PmToolsOptions}
                            </select>
                            <input type="text" className="input-field drop-down" id="PmToolsInput" name="PmToolsInput" placeholder="Please enter PmTools name" style={{ display: 'none' }} value={this.state.othersData.PmToolsInput || ''} onChange={this.myOhtersHandler} onKeyDown={this.addOtherData} />
                        </div>
                        <div>
                            <label className="label-pos">Agile Methodology Tools</label>
                            <select className="input-field drop-down drop-down" name="AgileMethodologyTools" value={this.state.fields.AgileMethodologyTools || ''} onChange={this.selectHandler} >
                                <option >Please Select</option>
                                {AgileMethodologyToolsOptions}
                            </select>
                            <input type="text" className="input-field drop-down" id="AgileMethodologyToolsInput" name="AgileMethodologyToolsInput" placeholder="Please enter AgileMethodologyTools name" style={{ display: 'none' }} value={this.state.othersData.AgileMethodologyToolsInput || ''} onChange={this.myOhtersHandler} onKeyDown={this.addOtherData} />
                        </div>
                        <div>
                            <label className="label-pos">BuildServer Tools</label>
                            <select className="input-field drop-down drop-down" name="BuildServerTools" value={this.state.fields.BuildServerTools || ''} onChange={this.selectHandler} >
                                <option >Please Select</option>
                                {BuildServerToolsOptions}
                            </select>
                            <input type="text" className="input-field drop-down" id="BuildServerToolsInput" name="BuildServerToolsInput" placeholder="Please enter AgileMethodologyTools name" style={{ display: 'none' }} value={this.state.othersData.BuildServerToolsInput || ''} onChange={this.myOhtersHandler} onKeyDown={this.addOtherData} />
                        </div>
                        <div>
                            <label className="label-pos">UnitTest Tools</label>
                            {/* <select className="input-field drop-down drop-down" name="UnitTestTools"  value={this.state.fields.UnitTestTools || ''}  onChange={this.selectHandler}>
                            <option >Please Select</option>
                                {UnitTestToolsOptions}
                            </select> */}
                            {/* Multi select */}
                            <div className="multiselect">
                                <div className="selectBox" onClick={this.showCheckboxes}>
                                    <select className="input-field drop-down drop-down">
                                        <option>Please Select</option>
                                    </select>
                                    <div className="overSelect"></div>
                                </div>
                                <div id="checkboxes">
                                    {UnitTestToolsOptions}
                                    {/* <label htmlFor="one">
                                    <input type="checkbox" id="one" />First checkbox</label>
                                <label htmlFor="two">
                                    <input type="checkbox" id="two" />Second checkbox</label>
                                <label htmlFor="three">
                                    <input type="checkbox" id="three" />Third checkbox</label> */}
                                </div>
                            </div>
                            {/* Multi Select */}
                        </div>
                        <input type="text" className="input-field drop-down" id="UnitTestToolsInput" name="UnitTestToolsInput" placeholder="Please enter UnitTestToolsInput name" style={{ display: 'none' }} value={this.state.othersData.UnitTestToolsInput || ''} onChange={this.myOhtersHandler} onKeyDown={this.addOtherData} />
                        <div>
                            <label className="label-pos">CodeCoverage Tools</label>
                            <select className="input-field drop-down drop-down" name="CodeCoverageTools" value={this.state.fields.CodeCoverageTools || ''} onChange={this.selectHandler}>
                                <option >Please Select</option>
                                {CodeCoverageToolsOptions}
                            </select>
                            <input type="text" className="input-field drop-down" id="CodeCoverageToolsInput" name="CodeCoverageToolsInput" placeholder="Please enter CodeCoverageToolsInput name" style={{ display: 'none' }} value={this.state.othersData.CodeCoverageToolsInput || ''} onChange={this.myOhtersHandler} onKeyDown={this.addOtherData} />
                        </div>
                        <div>
                            <label className="label-pos">BugTracking Tools</label>
                            <select className="input-field drop-down drop-down" name="BugTrackingTools" value={this.state.fields.BugTrackingTools || ''} onChange={this.selectHandler} >
                                <option >Please Select</option>
                                {BugTrackingToolsOptions}
                            </select>
                            <input type="text" className="input-field drop-down" id="BugTrackingToolsInput" name="BugTrackingToolsInput" placeholder="Please enter BugTrackingToolsInput name" style={{ display: 'none' }} value={this.state.othersData.BugTrackingToolsInput || ''} onChange={this.myOhtersHandler} onKeyDown={this.addOtherData} />
                        </div>
                        <div>
                            <label className="label-pos">Continuous Delivery Tools</label>
                            <select className="input-field drop-down drop-down" name="ContinuousDeliveryTools" value={this.state.fields.ContinuousDeliveryTools || ''} onChange={this.selectHandler} >
                                <option >Please Select</option>
                                {ContinuousDeliveryToolsOptions}
                            </select>
                            <input type="text" className="input-field drop-down" id="ContinuousDeliveryToolsInput" name="ContinuousDeliveryToolsInput" placeholder="Please enter ContinuousDeliveryTools name" style={{ display: 'none' }} value={this.state.othersData.ContinuousDeliveryToolsInput || ''} onChange={this.myOhtersHandler} onKeyDown={this.addOtherData} />
                        </div>
                        <div>
                            <label className="label-pos">Continuous Deployment Tools</label>
                            <select className="input-field drop-down drop-down" name="ContinuousDeploymentTools" value={this.state.fields.ContinuousDeploymentTools || ''} onChange={this.selectHandler}>
                                <option >Please Select</option>
                                {ContinuousDeploymentToolsOptions}
                            </select>
                            <input type="text" className="input-field drop-down" id="ContinuousDeploymentToolsInput" name="ContinuousDeploymentToolsInput" placeholder="Please enter ContinuousDeploymentTools name" style={{ display: 'none' }} value={this.state.othersData.ContinuousDeploymentToolsInput || ''} onChange={this.myOhtersHandler} onKeyDown={this.addOtherData} />
                        </div>
                        <div>
                            <button className="submit-btn" onClick={this.confirm}>Confirm</button>
                        </div>
                    </div>
                </form>
            </React.Fragment>
        )
    }
}

export default ToolsComponent;