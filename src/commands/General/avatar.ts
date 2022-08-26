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
            messageRun: 'serverAvatar'
        },
        {
            name: 'global',
            messageRun: 'globalAvatar',
            default: true
        }
    ]
})
export class UserCommand extends Subcommand {
    public async globalAvatar(message: Message) {
        const user = message.author;

        const embed = new MessageEmbed()
            .setTitle("Global Avatar of " + user.tag)
            .setImage(user.displayAvatarURL({ dynamic: true }))
            .setColor("#5865F2")

        return send(message, { embeds: [embed] });
    }

    public async serverAvatar(message: Message) {
        const guild = message.guild
        const user = message.author;
        const guildUser = guild?.members.cache.get(user.id)

        const embed = new MessageEmbed()
            .setTitle("Server Avatar of " + `${guildUser?.nickname} (${user.tag})` ?? user.tag)
            .setImage(guildUser?.displayAvatarURL({ dynamic: true }) ?? user.displayAvatarURL({ dynamic: true }))
            .setColor(guildUser?.displayColor as ColorResolvable)

        return send(message, { embeds: [embed] });
    }
}