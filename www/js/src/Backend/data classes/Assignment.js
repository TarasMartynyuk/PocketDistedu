// name : string, deadline : string
// assignmentDescription : string - html file
// resources : [ url, url... ] - pdf or doc(mostly))
function Assignment(name, deadline, assignmentDescription, resources) {
    this.name = name,
    this.deadline = deadline,
    this.assignmentDescription = assignmentDescription;
    this.resources = resources;
}