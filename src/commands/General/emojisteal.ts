import { ApplyOptions } from '@sapphire/decorators'
import { Command, Args } from '@sapphire/framework'
import { send } from '@sapphire/plugin-editable-commands'
import type { Message } from 'discord.js'

@ApplyOptions<Command.Options>({
    aliases: ["es"],
    description: "steals an emoji given by the user",
    generateDashLessAliases: true,
    requiredUserPermissions: 'MANAGE_EMOJIS_AND_STICKERS'
})
export class UserCommand extends Command {
    public async messageRun(message: Message, args: Args) {
        try {
            var emoji = await args.pick('emoji')
            const guild = message.guild
            var emojiUrl: string

            if (!guild?.emojis.cache!.find(e => e.id === emoji.id)) {

                console.log(emoji)

                if (emoji?.animated == true) {
                    emojiUrl = `https://cdn.discordapp.com/emojis/${emoji!.id}.gif`
                } else {
                    emojiUrl = `https://cdn.discordapp.com/emojis/${emoji!.id}.png`
                }

                return await guild!.emojis.create(emojiUrl, emoji.name!)
                    .then(e => send(message, { content: `Emoji ${e} ${e!.name} was added` }))
                    .catch(() => send(message, { content: `Emoji could not be added` }))
            } else {
                var returnEmoji = guild?.emojis.cache!.find(e => e.id === emoji.id)
                return send(message, {content: `Emoji ${returnEmoji} ${emoji.name} is already added`})
            }
        } catch {
            return send(message, { content: `Emoji was not found in command` })
        }
    }
}

