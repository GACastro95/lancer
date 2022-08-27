import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { TextBasedChannel, MessageEmbed } from 'discord.js';

@ApplyOptions<Command.Options>({
    aliases: ["q"],
    description: "embeds a quote to a discord message",
    generateDashLessAliases: true
})
export class UserCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder //
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption((option) =>
                    option //
                        .setName('message-link')
                        .setDescription('Message to quote')
                        .setRequired(true)
                )
        );
    }

    public async chatInputRun(interaction: Command.ChatInputInteraction) {
        const quote = interaction.options.getString('message-link')
        const messageProps = quote!.split('/').splice(4, 3)
        const guildId = messageProps[0]
        const channelId = messageProps[1]
        const messageId = messageProps[2]

        const guild = await interaction.client.guilds.fetch(guildId)
        const channelInfo = await guild.channels.fetch(channelId)
        const channel = channelInfo as TextBasedChannel

        const message = await channel?.messages.fetch(messageId, {
            cache: true,
            force: true
        })

        const user = await guild.members.fetch(message.author.id)

        console.log()

        var date = new Date(message.createdTimestamp)

        var hour = date.getUTCHours()
        var minutes = date.getUTCMinutes()

        var embed = new MessageEmbed()
            .setAuthor({ name: `${user.displayName} (${user.user.tag}) said...`, iconURL: `${user.displayAvatarURL()}` })
            .setDescription(`${message.content}`)
            .addFields(
                { name: `Source`, value: `[jump to message](${quote})`, inline: true }
            )
            .setFooter({text: `${guild.name} • #${channelInfo!.name} • ${date.toLocaleDateString('ja-JP')} at ${hour}:${minutes} UTC`})

        return interaction.reply({ embeds: [embed] })

    }
}

