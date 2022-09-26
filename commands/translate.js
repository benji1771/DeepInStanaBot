const deepl = require('deepl-node');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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

        const languageCodes = new Map();
        const languageNames = new Map();
        //Set Target Languages Options
        const targets = await translator.getTargetLanguages();
        languageCodes.set('english', 'en-US');
        languageCodes.set('chinese-simplified', 'zh');
        languageNames.set('en', 'English');
        for(let i = 0; i < targets.length; i++){
            languageCodes.set(targets[i].name.toLowerCase(), targets[i].code);
            languageNames.set(targets[i].code, targets[i].name);
        }

        //Grab User Inputs
        const userInput = interaction.options.getString('input');
        const outputLanguage = interaction.options.getString('target');
        
        const targetLanguageCode = outputLanguage ? languageCodes.get(outputLanguage.toLowerCase()) : 'en-US';
        const translated =  await translator.translateText(userInput, null, targetLanguageCode);
        
        const embed = new EmbedBuilder()
			.setColor(0xE4A43F)
			.setTitle(languageNames.get(targetLanguageCode))
			.setDescription(translated.text);

        await interaction.reply({ content: userInput, embeds: [embed] });
		
	},
};