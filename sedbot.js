/*
   Copyright 2016 prussian <generalunrest@airmail.cc>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var config = require('./config')
var irc = require('irc')

var client = new irc.Client(config.server, config.nick, config.options)

// last client message
var messages = {}

client.addListener('message#', function (from, to, text) {

	var matches

	// when user asks for bots to report in
	if (/^\.bots/.test(text) || /^!bots/.test(text)) { 
		client.say(
			to, 'sedbot [NodeJS], '+
			'fix your last post using: s/regex/replace/(gi|g|i|)'
		) 
		return
	}

	// first match is the regex, 
	// second replace string third is optional flags
	// optinal flags 
	// gi means (G)lobal and case (I)nsensitive
	// g means (G)lobal 
	// i means case (I)nsensitive
	matches = text.match(/s\/(.*)\/(.*)\/(gi|g|i|)/)

	// NOTE: DoS is possible if user gives a slow RegExp
	if (matches && messages[from]) {
		
		try {
			client.say(to, '<'+from+'> '+messages[from]
				.replace(
					RegExp(matches[1], matches[3]), matches[2]
				)
			)
		}
		catch (e) {
			client.say(to, e.message)
		}
	}

	messages[from] = text
})

client.addListener('invite', function(channel) {

	client.join(channel)
})
