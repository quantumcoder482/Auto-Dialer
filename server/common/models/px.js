'use strict';

const moment = require('moment');
const util = require('util');
const soap = require('strong-soap').soap;
const loopback = require('loopback');
const nodemailer = require("nodemailer");
const mandrillTransport = require('nodemailer-mandrill-transport');

module.exports = function(Px) {

	Px.beforeRemote('**', function (context, unused, next) {

		let formData = context.args.data,
			requestObject;

		formData.dateTime = moment(new Date(formData.dateTime));
		formData.dob = moment(new Date(formData.dob)).format("YYYY-MM-DD");
		formData.dobYear = moment(new Date(formData.dob)).format("YYYY");
		formData.dobMonth = moment(new Date(formData.dob)).format("MM");
		formData.dobDay = moment(new Date(formData.dob)).format("DD");

		//format Household Income
		if(formData.householdIncome <= 30000) {
			formData.householdIncome = `Below $30,000`;
		} else if (formData.householdIncome > 30000 && formData.householdIncome <= 44999) {
			formData.householdIncome = `$30,000 - $44,999`;
		} else if (formData.householdIncome > 45000 && formData.householdIncome <= 59999) {
			formData.householdIncome = `$45,000 - $59,999`;
		} else if (formData.householdIncome > 60000 && formData.householdIncome <= 74999) {
			formData.householdIncome = `$60,000 - $74,999`;
		} else {
			formData.householdIncome = `Above $75,000`;
		}

		requestObject = {
		  type: "jsonwsp/request",
		  version: "1.0",
		  methodname: "Lead.Insert",
		  LeadData: {
		    Target: "Lead.Insert",
		    PartnerToken: "06A5189C-3B8F-4D5D-AD1B-B0EA9D55FC4D",
		    // Partner: "insurancetest2@pp.com",A
		    // Password: "4insurancepp",
		    RequestTime: formData.dateTime,
		    UserAgent: formData.userAgent,
		    OriginalURL: "https://www.healthcare.us.com",
		    TCPAText: formData.disclosure,
		    AffiliateData: {
		      Id: "10204",
		      OfferId: "220",
		      SubId: "220",
		      Source: "All",
		      VerifyAddress: "false",
		      RespondOnNoSale: "true",
		      SellResponseURL: "",
		      LeadId: formData.leadId,
		      TrustedForm: formData.trustedForm,
		      ClickConsentID: ""
		    },
		    ContactData: {
		      FirstName: formData.firstName,
		      LastName: formData.lastName,
		      Address: formData.address,
		      City: formData.city,
		      State: formData.state,
		      ZIPCode: formData.postalCode,
		      EmailAddress: formData.email,
		      PhoneNumber: formData.phone,
		      IPAddress: formData.ip,
		      ResidenceType: "My own house",
		      MonthsAtResidence: 10
		    },
		    QuoteRequest: {
		      QuoteType: "Health",
		      Persons: {
		        Person: {
		          Id: "1",
		          BirthDate: moment(new Date(formData.dob)).format("YYYY-MM-DD"),
		          RelationshipToApplicant: "Self",
		          Gender: formData.gender,
		          USResidence: "True",
		          HouseHoldIncome: formData.householdIncome,
		          HouseHoldSize: formData.dependencies,
		          Conditions: "None", //formData.conditions.join(','),
		          Student: "False",
		          Occupation: "Other",
		          Education: "Bachelors Degree",
		          MaritalStatus: "Single",
		          DeniedInsurance: "No",
		          Height_FT: "5",
		          Height_Inch: "8",
		          Weight: "160",
		          MedicalHistory: {
		            Hospitalized: "No",
		            Pregnant: formData.pregnant,
		            Smoker: formData.tobaccoUser,
		            Alcoholabstain: "Yes"

		          }
		        }
		      },
		      Insurance: {
		        RequestedPolicy: {
		          CoverageType: formData.coverageType ? formData.coverageType : "Individual Family"
		        },
		        CurrentPolicy: {
					InsuranceCompany: "Currently not insured"
				}
		      }
		    }
		  }
		}

		context.args.data = requestObject;

		console.log(util.inspect(context.args.data,  false, null, true));

		next();
	})

	Px.afterRemote('insertLead', function (context, unused, next) {

		let responseData = context.result;
		// 	emailData = context.req.body,
		// 	emailDob = moment(new Date(emailData.dob)).format("YYYY-MM-DD");

		// responseData = JSON.parse(xmljs.toJson(responseData));

		console.log(util.inspect(responseData, false, null, true));

		// if(responseData.response.success) {
		// 	loopback.Email.send({
		// 	    to: emailData.email,
		// 	    template: {
		// 	        name: "healthcare-options",
		// 	    },
		// 	    global_merge_vars: [
		// 	      //in your mandrill template `*|team|*` or `*|TEAM|*`
		// 	      {
		// 	        name: 'ZIP_CODE',
		// 	        content: emailData.postalCode
		// 	      },
		// 	      {
		// 	        name: 'FIRST_NAME',
		// 	        content: emailData.firstName
		// 	      },
		// 	      {
		// 	        name: 'LAST_NAME',
		// 	        content: emailData.lastName
		// 	      },
		// 	      {
		// 	        name: 'STATE',
		// 	        content: emailData.state
		// 	      },
		// 	      {
		// 	        name: 'AGE',
		// 	        content: moment(new Date, "YYYY-MM-DD").diff(emailDob, 'years')
		// 	      }
		// 	    ]
		// 	},
		// 	function(err, result) {
		// 	    if(err) {
		// 	        console.log(err);
		// 	        return;
		// 	    }
		// 	    console.log(result);
		// 	});
		// }

		context.result = responseData;

		next();

	})

};
