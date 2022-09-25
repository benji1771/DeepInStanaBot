const deepl = require('deepl-node');
const { SlashCommandBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();


const translator = new deepl.Translator(process.env.DLTOKEN);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('Translates text to a target language')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The Text to translate')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('target')
                .setDescription('Language to be translated to')
                .setRequired(false)),
	async execute(interaction) {
        
        const userInput = interaction.options.getString('input');
        const outputLanguage = interaction.options.getString('target');

        const languageCodes = new Map();
        
        const targets = await translator.getTargetLanguages();

        languageCodes.set('english', 'en-US');
        languageCodes.set('chinese-simplified', 'zh');
        for(let i = 0; i < targets.length; i++){
            languageCodes.set(targets[i].name.toLowerCase(), targets[i].code);
            
        }
        
        const targetLanguageCode = outputLanguage ? languageCodes.get(outputLanguage.toLowerCase()) : 'en-US';
        
        const translated =  await translator.translateText(userInput, null, targetLanguageCode);
        await interaction.reply(translated.text);
		
	},
};