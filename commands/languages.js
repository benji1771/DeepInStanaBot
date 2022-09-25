const deepl = require('deepl-node');
const { SlashCommandBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();


const translator = new deepl.Translator(process.env.DLTOKEN);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('languages')
		.setDescription('List supported languages'),
	async execute(interaction) {
        const targets = await translator.getTargetLanguages();
        let supportedLanguages = 'English (Default)\nChinese-Simplified\n'
        for(let i = 0; i < targets.length; i++){
            supportedLanguages = supportedLanguages + targets[i].name + '\n'
            
        }
        await interaction.reply(supportedLanguages);
		
	},
};