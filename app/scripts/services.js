'use strict';

angular.module('myApprovalsApp').service('ResourceService', function() {
        this.getItems = function(endpoint) {
            var test = { "results" : [ { id : "1982", name : "Mr Bob"}, { id : "18273", name : "Mrs Katrine"} ]};
            return test;
        };
    });