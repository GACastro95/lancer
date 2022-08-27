import { ApplyOptions } from '@sapphire/decorators'
import { Command, Args } from '@sapphire/framework'
import { send } from '@sapphire/plugin-editable-commands'
import type { Message } from 'discord.js'

@ApplyOptions<Command.Options>({
    aliases: ["be"],
    description: "posts a large version of an emoji",
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
                        .setName('emoji')
                        .setDescription('Emoji to post')
                        .setRequired(true)
                )
        );
    }

    public async messageRun(message: Message, args: Args) {
        try {
            var emoji = await args.pick('emoji')
            var emojiUrl: string

            if (emoji?.animated == true) {
                emojiUrl = `https://cdn.discordapp.com/emojis/${emoji!.id}.gif`
            } else {
                emojiUrl = `https://cdn.discordapp.com/emojis/${emoji!.id}.png`
            }

            return send(message, { content: `${emojiUrl}` })

        } catch {
            return send(message, { content: `Emoji was not found in command` })
        }
    }

    public async chatInputRun(interaction: Command.ChatInputInteraction) {
        const emoji = interaction.options.getString('emoji')
        const validEmoji = /a?:?(.+):(\d+)/.test(emoji!)
        var emojiUrl: string
        const emojiProps = emoji?.split(':')
        const emojiAnimated = emojiProps![0].replace('<', '')
        const emojiId = emojiProps![emojiProps!.length - 1].replace('>', '')

        if (!validEmoji && emoji! !== null) {
            return interaction.reply({ content: `Invalid emoji given` })
        }

        if (emojiAnimated === 'a') {
            emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.gif`
        } else {
            emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.png`
        }
        return interaction.reply({ content: `${emojiUrl}` })

    }
}

