/******************************************************************************
     Copyright:: 2020- IBM, Inc

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
  *****************************************************************************/

/*******************************************************************************
 * NAME: addResultsToGlobal.js
 * DESCRIPTION: Used to test the addResultsToGlobal function in ACReporterCommon.js

 *******************************************************************************/

'use strict';

// Load all the modules that are needed
var path = require('path');
var decache = require('decache');
var test = require('ava');

// Load the function that will be tester
var ACReporterCommon = require(path.join(__dirname, '..', '..', '..', '..', 'src', 'lib', 'reporters', 'ACReporterCommon'));

// Load a mock logger and set it in to ACReporterCommon
ACReporterCommon.log = require(path.join(__dirname, '..', '..', 'unitTestCommon', 'commonTestHelpers', 'logger'));

// Stores the unitTest common objects
var unitTestCommon;

// Path to the unitTest common module
var unitTestCommonModule = path.join(__dirname, '..', '..', 'unitTestCommon', 'commonTestHelpers', 'unitTestCommon');

test.beforeEach(function () {
    decache(unitTestCommonModule);
    unitTestCommon = require(unitTestCommonModule);
});

test('addResultsToGlobal(results) should add page summary object to ACReporterCommon.scanSummary.pageScanSummary', function (ava) {

    // Pass the mock config object into initialize summary function to add results to global
    ACReporterCommon.scanSummary = ACReporterCommon.initializeSummary(unitTestCommon.configMock);

    // Pass the mock scan result object into add results to global
    ACReporterCommon.addResultsToGlobal(unitTestCommon.scanPageOutput);

    // Expected results once results are added to global
    var expectedPageScanSummary = {
        "counts": {
            "manual": 0,
            "potentialrecommendation": 0,
            "potentialviolation": 0,
            "recommendation": 0,
            "violation": 1,
            "ignored": 0
        },
        "label": "scanPageOutputDefault.html"
    };

    ava.deepEqual(ACReporterCommon.scanSummary.pageScanSummary[0], expectedPageScanSummary);
});

test('addResultsToGlobal(results) should update ACReporterCommon.scanSummary', function (ava) {

    // Pass the mock config object into initialize summary function to add results to global
    ACReporterCommon.scanSummary = ACReporterCommon.initializeSummary(unitTestCommon.configMock);

    // Pass the mock scan result object into add results to global
    ACReporterCommon.addResultsToGlobal(unitTestCommon.scanPageOutput);

    // Expected results once results are added to global
    var expectedPageScanSummary = {
        "counts": {
            "manual": 0,
            "potentialrecommendation": 0,
            "potentialviolation": 0,
            "recommendation": 0,
            "violation": 1,
            "ignored": 0
        },
        "label": "scanPageOutputDefault.html"
    };

    // Update the expected scan summary with the expected page scan summary
    unitTestCommon.expectScanSummary.pageScanSummary.push(expectedPageScanSummary);

    // Update the toolID to make sure it is latest
    unitTestCommon.expectScanSummary.toolID = unitTestCommon.toolID;

    // Update some of the items to make sure they are consistent with expected scan
    ACReporterCommon.scanSummary.startReport = 999999999999;

    ava.deepEqual(ACReporterCommon.scanSummary, unitTestCommon.expectScanSummary);
});

test.afterEach.always(function () {
    decache(unitTestCommonModule);
    unitTestCommon = undefined;
});
