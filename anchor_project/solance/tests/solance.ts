import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solance } from "../target/types/solance";
import { expect } from "chai";
import { strict as assert } from "assert";  

describe("solance program", () => {

  const CLIENT_SEED = "client";
  const CONTRACTOR_SEED = "contractor";
  const CONTRACT_SEED = "contract";
  const PROPOSAL_SEED = "proposal";
  const TITLE_MAX_LENGTH = 100;
  const TOPIC_MAX_LENGTH = 500;

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.solance as Program<Solance>;
  
  // Client consts 
  const client = anchor.web3.Keypair.generate();
  const [client_pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from(CLIENT_SEED),              
          client.publicKey.toBuffer(),
        ],
        program.programId
      );
  const client_no_fund = anchor.web3.Keypair.generate();
  const client_no_fund_pda = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(CLIENT_SEED),              
      client_no_fund.publicKey.toBuffer(),
    ], 
    program.programId
  )
  const space_client_account = 8 + 32 + 1 + 8;

  // Contractor consts
  const contractor = anchor.web3.Keypair.generate();
  const [contractor_pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONTRACTOR_SEED),              
          contractor.publicKey.toBuffer(),
        ],
        program.programId
      );
  const contractor_no_fund = anchor.web3.Keypair.generate();
  const contractor_no_fund_pda = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(CONTRACTOR_SEED),              
      contractor_no_fund.publicKey.toBuffer(),
    ], 
    program.programId
  )
  const contractor_attacker = anchor.web3.Keypair.generate();
  const [contractor_attacker_pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONTRACTOR_SEED),              
          contractor_attacker.publicKey.toBuffer(),
        ],
        program.programId
      );
  const space_contractor_account = 8 + 32 + 1 + 8;

  // Contract consts
  const client_attacker = anchor.web3.Keypair.generate();
  const [client_attacker_pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from(CLIENT_SEED),              
          client_attacker.publicKey.toBuffer(),
        ],
        program.programId
      );
  const id = new anchor.BN(0);
  const [first_contract_pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONTRACT_SEED),              
          client_pda.toBuffer(),
          id.toArrayLike(Buffer, "le", 8)
        ],
        program.programId
      );
  const second_id = new anchor.BN(1);
  const [second_contract_pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONTRACT_SEED),              
          client_pda.toBuffer(),
          second_id.toArrayLike(Buffer, "le", 8)
        ],
        program.programId
      );


  const good_title_length = "Blockchain Engineer on Solana";
  let wrong_title_length = good_title_length.repeat(10);
  const good_topic_length = "I need a blockchain engineer to write programs on Solana dApp";
  let wrong_topic_length = good_topic_length.repeat(10);

  // Proposal consts
  const proposal_id = new anchor.BN(0);
  const [first_proposal_pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from(PROPOSAL_SEED),              
          contractor_pda.toBuffer(),
          proposal_id.toArrayLike(Buffer, "le", 8)
        ],
        program.programId
      );
  const second_proposal_id = new anchor.BN(1);
  const [second_proposal_pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from(PROPOSAL_SEED),              
          contractor_pda.toBuffer(),
          second_proposal_id.toArrayLike(Buffer, "le", 8)
        ],
        program.programId
      );
  const [first_proposal_attacker_pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from(PROPOSAL_SEED),              
          contractor_attacker_pda.toBuffer(),
          proposal_id.toArrayLike(Buffer, "le", 8)
        ],
        program.programId
      );
  const amount = new anchor.BN(1_000_000_000);    


  describe("initialize client", () => {

    it("It Should successfully initialize a Client account with 0 on next_contract_id", async () => {

      await airdrop(provider.connection, client.publicKey);
        
      await program.methods
        .initializeClientIx()
        .accounts({
          client: client.publicKey, 
          clientAccount: client_pda, 
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([client])
        .rpc({ commitment: "confirmed" });         

      const clientAccount = await program.account.client.fetch(client_pda);

      expect(clientAccount.owner.toBase58()).to.equal(client.publicKey.toBase58());
      expect(clientAccount.nextContractId.toNumber()).to.equal(0);
    });

    it("It Should fail when we want to initialize a Client account already initialized", async () => {

      await assert.rejects(
        program.methods
          .initializeClientIx()
          .accounts({
            client: client.publicKey, 
            clientAccount: client_pda, 
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([client])
          .rpc({ commitment: "confirmed" }),
      ),
      (err: any) => {
        const anchorErr = err as anchor.AnchorError;
        if (anchorErr.error.errorCode.code === "ClientAlreadyInitialized") {
          return true;
        }
        return false;
      }

    });

    it("Should fail to initialize client when payer has not enough funds", async () => {

      const requiredRent = await provider.connection.getMinimumBalanceForRentExemption(space_client_account);
      await airdrop(provider.connection, client_no_fund.publicKey, requiredRent - 1);

      await assert.rejects(
        program.methods
          .initializeClientIx()
          .accounts({
            client: client_no_fund.publicKey, 
            clientAccount: client_no_fund_pda, 
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([client_no_fund])
          .rpc({ commitment: "confirmed" })
        );
    });


    });

    describe("initialize contractor", () => {

      it("It Should successfully initialize a Contractor account with 0 on next_proposal_id", async () => {

            await airdrop(provider.connection, contractor.publicKey);
              
            await program.methods
              .initializeContractorIx()
              .accounts({
                contractor: contractor.publicKey, 
                contractorAccount: contractor_pda, 
                systemProgram: anchor.web3.SystemProgram.programId,
              })
              .signers([contractor])
              .rpc({ commitment: "confirmed" });         

            const contractorAccount = await program.account.contractor.fetch(contractor_pda);

            expect(contractorAccount.owner.toBase58()).to.equal(contractor.publicKey.toBase58());
            expect(contractorAccount.nextProposalId.toNumber()).to.equal(0);
          });

      it("It Should fail when we want to initialize a Contractor account already initialized", async () => {

        await assert.rejects(
          program.methods
            .initializeContractorIx()
            .accounts({
              contractor: contractor.publicKey, 
              contractorAccount: contractor_pda, 
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([contractor])
            .rpc({ commitment: "confirmed" }),
        ),
        (err: any) => {
          const anchorErr = err as anchor.AnchorError;
          if (anchorErr.error.errorCode.code === "ContractorAlreadyInitialized") {
            return true;
          }
          return false;
        }

      });

      it("Should fail to initialize contractor when payer has not enough funds", async () => {

        const requiredRent = await provider.connection.getMinimumBalanceForRentExemption(space_contractor_account);
        await airdrop(provider.connection, contractor_no_fund.publicKey, requiredRent - 1);

        await assert.rejects(
          program.methods
            .initializeContractorIx()
            .accounts({
              contractor: contractor_no_fund.publicKey, 
              contractorAccount: contractor_no_fund_pda, 
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([contractor_no_fund])
            .rpc({ commitment: "confirmed" })
          );
      });
    });

    describe("initialize contract", async() => {

      it("It Should successfully initialize a Contract account with 0 as contract id", async () => {

        await program.methods
              .initializeContractIx(good_title_length, good_topic_length)
              .accounts({
                signer: client.publicKey, 
                clientAccount: client_pda, 
                contractAccount: first_contract_pda,
                systemProgram: anchor.web3.SystemProgram.programId,
              })
              .signers([client])
              .rpc({ commitment: "confirmed" });         

      }); 

      it("It Should fail to initialize a Contract with a title that is longer than 100 bytes", async () => {

        await assert.rejects( 
          program.methods
              .initializeContractIx(wrong_title_length, good_topic_length)
              .accounts({
                signer: client.publicKey, 
                clientAccount: client_pda, 
                contractAccount: second_contract_pda,
                systemProgram: anchor.web3.SystemProgram.programId,
              })
              .signers([client])
              .rpc({ commitment: "confirmed" })
          , (err: any) => {
              const anchorErr = err as anchor.AnchorError;
              if (anchorErr.error.errorCode.code === "TitleTooLong") {
                return true;
              }
              return false;
          })    
          
      });

      it("It Should fail to initialize a Contract with a topic that is longer than 500 bytes", async () => {

        await assert.rejects( 
          program.methods
              .initializeContractIx(good_title_length, wrong_topic_length)
              .accounts({
                signer: client.publicKey, 
                clientAccount: client_pda, 
                contractAccount: second_contract_pda,
                systemProgram: anchor.web3.SystemProgram.programId,
              })
              .signers([client])
              .rpc({ commitment: "confirmed" })
          , (err: any) => {
              const anchorErr = err as anchor.AnchorError;
              if (anchorErr.error.errorCode.code === "TopicTooLong") {
                return true;
              }
              return false;
          });        
        }); 
      
      it("It Should fail to initialize a Contract when the signer is not the owner of the Client Account", async () => {

        await airdrop(provider.connection, client_attacker.publicKey);

        await program.methods
          .initializeClientIx()
          .accounts({
            client: client_attacker.publicKey, 
            clientAccount: client_attacker_pda, 
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([client_attacker])
          .rpc({ commitment: "confirmed" });       

        await assert.rejects( 
          program.methods
              .initializeContractIx(good_title_length, good_topic_length)
              .accounts({
                signer: client_attacker.publicKey, 
                clientAccount: client_pda, 
                contractAccount: second_contract_pda,
                systemProgram: anchor.web3.SystemProgram.programId,
              })
              .signers([client_attacker])
              .rpc({ commitment: "confirmed" })
          , (err: any) => {
              const anchorErr = err as anchor.AnchorError;
              if (anchorErr.error.errorCode.code === "UnauthorizedAccount") {
                return true;
              }
              return false;
          });        
      }); 
    });

    describe("initialize proposal", async() => {

      it("It Should successfully initialize a Proposal account with 0 as proposal id", async () => {

        await program.methods
          .initializeProposalIx(amount)
          .accounts({
            contractor: contractor.publicKey, 
            contract: first_contract_pda,
            contractorAccount: contractor_pda, 
            proposalAccount: first_proposal_pda, 
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([contractor])
          .rpc({ commitment: "confirmed" });     

      });    

      it("It Should fail to initialize a Proposal when the signer is not the owner of the Contractor Account", async () => {

          await airdrop(provider.connection, contractor_attacker.publicKey);

          await program.methods
              .initializeContractIx(good_title_length, good_topic_length)
              .accounts({
                signer: client.publicKey, 
                clientAccount: client_pda, 
                contractAccount: second_contract_pda,
                systemProgram: anchor.web3.SystemProgram.programId,
              })
              .signers([client])
              .rpc({ commitment: "confirmed" })

          await assert.rejects(
            program.methods
              .initializeProposalIx(amount)
              .accounts({
                contractor: contractor_attacker.publicKey, 
                contract: second_contract_pda,
                contractorAccount: contractor_pda, 
                proposalAccount: second_proposal_pda, 
                systemProgram: anchor.web3.SystemProgram.programId,
              })
              .signers([contractor_attacker])
              .rpc({ commitment: "confirmed" })
            , (err: any) => {
              const anchorErr = err as anchor.AnchorError;
              if (anchorErr.error.errorCode.code === "UnauthorizedAccount") {
                return true;
              }
              return false;
          });                           

      });

    
    });



});


async function airdrop(connection: any, address: any, amount = 1000000000) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}

class SolanaError {
  static contains(logs, error): boolean {
    const match = logs?.filter(s => s.includes(error));
    return Boolean(match?.length)
  }
}