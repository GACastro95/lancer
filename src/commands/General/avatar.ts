import { ApplyOptions } from '@sapphire/decorators';
import { send } from "@sapphire/plugin-editable-commands";
import { Subcommand } from '@sapphire/plugin-subcommands';
import { ColorResolvable, Message, MessageEmbed } from 'discord.js';

@ApplyOptions<Subcommand.Options>({
    aliases: ["av"],
    description: "shows the user avatar",
    generateDashLessAliases: true,
    subcommands: [
        {
            name: 'server',
            messageRun: 'serverAvatarMessage',
            chatInputRun: 'serverAvatarInteraction'
        },
        {
            name: 'global',
            messageRun: 'globalAvatarMessage',
            chatInputRun: 'globalAvatarInteraction',
            default: true
        }
    ]
})
export class UserCommand extends Subcommand {
    public override registerApplicationCommands(registry: Subcommand.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addSubcommand((command) =>
                    command
                        .setName('server')
                        .setDescription('Get the server avatar of the user')
                )
                .addSubcommand((command) =>
                    command
                        .setName('global')
                        .setDescription('Get the global avatar of the user'))
        )
    }

    public async globalAvatarMessage(message: Message) {
        const user = message.author;

        const embed = new MessageEmbed()
            .setTitle("Global Avatar of " + user.tag)
            .setImage(user.displayAvatarURL({ dynamic: true }))
            .setColor("#5865F2")

        return send(message, { embeds: [embed] });
    }

    public async globalAvatarInteraction(interaction: Subcommand.ChatInputInteraction) {
        const user = interaction.user;

        const embed = new MessageEmbed()
            .setTitle("Global Avatar of " + user.tag)
            .setImage(user.displayAvatarURL({ dynamic: true }))
            .setColor("#5865F2")

        return interaction.reply({ embeds: [embed] });
    }

    public async serverAvatarMessage(message: Message) {
        const guild = message.guild
        const user = message.author;
        const guildUser = guild?.members.cache.get(user.id)

        const embed = new MessageEmbed()
            .setTitle("Server Avatar of " + `${guildUser?.nickname} (${user.tag})` ?? user.tag)
            .setImage(guildUser?.displayAvatarURL({ dynamic: true }) ?? user.displayAvatarURL({ dynamic: true }))
            .setColor(guildUser?.displayColor as ColorResolvable)

        return send(message, { embeds: [embed] });
    }

    public async serverAvatarInteraction(interaction: Subcommand.ChatInputInteraction) {
        const guild = interaction.guild
        const user = interaction.user;
        const guildUser = guild?.members.cache.get(user.id)

        const embed = new MessageEmbed()
            .setTitle("Server Avatar of " + `${guildUser?.nickname} (${user.tag})` ?? user.tag)
            .setImage(guildUser?.displayAvatarURL({ dynamic: true }) ?? user.displayAvatarURL({ dynamic: true }))
            .setColor(guildUser?.displayColor as ColorResolvable)

        return interaction.reply({ embeds: [embed] });
    }
}