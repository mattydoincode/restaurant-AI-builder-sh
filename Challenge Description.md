## Challenge Description
In the time allotted, build an MVP of a website builder for restaurant owners and operators. The purpose of your website is to help these users make unique, compelling, and useful websites for their restaurants. The rest is up to you.

We will be grading your submission primarily based on your product instincts and your ability to create a polished and useful MVP in a short time. We recommend avoiding complex production-like features such as allowing users to bring their own domains or accepting payments. See below for additional context around the limited nature of the infrastructure available to you.

### Submission Instructions
Please commit your work to a publicly available GitHub repository and ensure that your work is on the main branch of that repository. We will reject any repositories that contain commits beyond your personal 2-hour deadline, so please refrain from committing and pushing code after the time is up.

During the submission review process, the Ethena team will deploy your repository to a Railway container. Your submission will likely require environment variables and deploy instructions such as networking considerations. To that end, you are encouraged to submit an `instructions.md` file on this page that includes:

- Any specific deploy instructions
- Any `.env` variables that we should set
- Anything else we should know

The Ethena engineering team will treat your `instructions.md` submission as a sensitive file, will only deploy your code temporarily to test it, and will not abuse any API keys included as `.env` variables in the `instructions.md` file.

Overly complex deployment instructions will count against you. We will not spin up additional resources beyond a simple container, so your project should be self contained (e.g. no external databases or other infra dependencies). Railway services contain a small amount of ephemeral disk space that should be sufficient for this MVP.

P.S. Using AI to generate entire applications in 2 hours is not how we approach production engineering at Ethena, but we feel that it is a solid expression of one's product thinking and command over AI tools. We're as surprised as you are that this is the timeline we find ourselves in.