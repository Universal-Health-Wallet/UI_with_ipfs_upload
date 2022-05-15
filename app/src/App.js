import './App.css';
import {
  useState, useEffect
} from 'react';
import {
  Connection,
  PublicKey
} from '@solana/web3.js';
import {
  Program,
  Provider,
  web3
} from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import idl from './ehr.json';
import {
  getPhantomWallet
} from '@solana/wallet-adapter-wallets';
import {
  useWallet,
  WalletProvider,
  ConnectionProvider
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { Button,Col,Row, Form } from 'react-bootstrap';
import { useSnackbar } from "notistack";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';    
require('@solana/wallet-adapter-react-ui/styles.css');
// import * from "@solana/spl-token";

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  getPhantomWallet()
]

const dao_wallet = new PublicKey('HYGfysCSyEX46cVqFK37fZq2JcGuim1KTBD8KLa3Hdyb');
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

const {
  SystemProgram,
  Keypair
} = web3;
/* create an account  */
const baseAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function App() {
  const [value, setValue] = useState({
    tweets: [],
    twitterUsers: [],
  });
  const wallet = useWallet();
  let twitterUsers = [];
  let tweets = [];

  const enqueSnackbar = useSnackbar();

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = "https://api.devnet.solana.com";
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }

  async function getDoctors() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    const doctorAccounts = await program.account.doctorProfile.all();
    console.log("Doctor Accounts : ",doctorAccounts);
  }

  async function getPatients() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    const patientAccounts = await program.account.patientProfile.all();
    console.log("Patient Accounts : ",patientAccounts);
  }

  async function getTechnicians() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    const technicianAccounts = await program.account.technicianProfile.all();
    console.log("Technician Accounts : ",technicianAccounts);
  }

  async function getBloodReports() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    const bloodTestReports = await program.account.bloodtestReport.all();
    console.log("Blood Test Reports : ",bloodTestReports);
  }

  async function getGeneralConsultancy() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    const generalConsultAccounts = await program.account.generalConsultancy.all();
    console.log("General Consultancy Accounts : ",generalConsultAccounts);
  }


  // async function findAssociatedTokenAddress(walletAddress,tokenMintAddress) {
  //   return (await PublicKey.findProgramAddress(
  //       [
  //           provider.wallet.publicKey.toBuffer(),
  //           TOKEN_PROGRAM_ID.toBuffer(),
  //           tokenMintAddress.toBuffer(),
  //       ],
  //       SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  //   ))[0];
  // }

  async function getAllAccounts() {
    getDoctors();
    getPatients();
    getTechnicians();
    getBloodReports();
    getGeneralConsultancy();
  }

  async function createDoctorAccount() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    var new_keypar = web3.Keypair.generate();
    try {
      const [newDoctorPda,newDoctorBump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("doctor-profile"),
          provider.wallet.publicKey.toBuffer()
        ],
        programID
      );
      let gc_fee_bn = new anchor.BN(500);
      let time = new anchor.BN(Date.now() / 1000);
      const doctor_profile = await program.rpc.initDoctorProfile('Junaid','Male','09/03/1995',60,gc_fee_bn,true,time,{
        accounts: {
          doctorProfile: newDoctorPda,
          doctor: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId
        }
      });
      getDoctors();
    } catch (error) {
      
    }
  }

  async function createPatientAccount() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    var new_keypar = web3.Keypair.generate();
    try {
      const [newPatientPda,newPatientBump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("patient-profile"),
          provider.wallet.publicKey.toBuffer()
        ],
        programID
      );
      const patient_profile = await program.rpc.initPatientProfile('Vamshi','Male','05/03/1995',{
        accounts: {
          patientProfile: newPatientPda,
          patient: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId
        }
      });
      getPatients();
    } catch (error) {
      
    }
  }

  async function createTechinicianAccount() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    var new_keypar = web3.Keypair.generate();
    try {
      const [newTechnicianPda,newDoctorBump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("technician-profile"),
          provider.wallet.publicKey.toBuffer()
        ],
        programID
      );
      let gc_fee_bn = new anchor.BN(500);
      let time = new anchor.BN(Date.now() / 1000);
      const technician_profile = await program.rpc.initTechnicianProfile('Vamshi','Male','05/03/1995',60,gc_fee_bn,true,time,{
        accounts: {
          technicianProfile: newTechnicianPda,
          technician: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId
        }
      });
      getTechnicians();
    }
    catch {

    }
  }

  async function createBloodTestBooking() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    var new_keypar = web3.Keypair.generate();
    const [bloodTestPda,bloodTestBump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("bloodtest-report"),
        provider.wallet.publicKey.toBuffer()
      ],
      programID
    );
    const patientAccounts = await program.account.patientProfile.all();
    const technicianAccounts = await program.account.technicianProfile.all();
    const [patientPda,patientBump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("patient-profile"),
        patientAccounts[0].publicKey.toBuffer()
      ],
      programID
    );
    const [technicianPda,technicianBump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("technician-profile"),
        technicianAccounts[0].publicKey.toBuffer()
      ],
      programID
    );
    const network = "https://api.devnet.solana.com";
    const connection = new Connection(network, opts.preflightCommitment);
    let usdc_key = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
    const account = await connection.getTokenAccountsByOwner(provider.wallet.publicKey,{mint:usdc_key});
    // const account_one = await connection.;
    console.log(account);
    const accounts = await connection.getProgramAccounts(
      TOKEN_PROGRAM_ID,
      {
        dataSlice: {
          offset: 0, // number of bytes
          length: 0, // number of bytes
        },
        filters: [
          {
            dataSize: 165, // number of bytes
          },
          {
            memcmp: {
              offset: 0, // number of bytes
              bytes: provider.wallet.publicKey.toBase58(), // base58 encoded string
            },
          },
        ],
      }
    );
    console.log(accounts);
    const blood_test_booking = await program.rpc.initBloodtestBooking({
      accounts: {
        bloodtestReport: bloodTestPda,
        patientProfile: patientPda,
        technicianProfile: technicianPda,
        patientDepositTokenAccount: '',
        uhwDaoWallet: dao_wallet,
        patient: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID
      }
    })
  }

  async function createGeneralConsultancy() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    var new_keypar = web3.Keypair.generate();
    try {
      const [generalConultPda,generalConultBump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("general-consultancy"),
          provider.wallet.publicKey.toBuffer()
        ],
        programID
      );
      const patientAccounts = await program.account.patientProfile.all();
      const doctorAccounts = await program.account.doctorProfile.all();
      const [patientPda,patientBump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("patient-profile"),
          patientAccounts[0].publicKey.toBuffer()
        ],
        programID
      );
      const [doctorPda,technicianBump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("doctor-profile"),
          doctorAccounts[0].publicKey.toBuffer()
        ],
        programID
      );
  
      const blood_test_booking = await program.rpc.initGcBooking('testing',{
        accounts: {
          generalConsultancy: generalConultPda,
          patientProfile: patientPda,
          doctorProfile: doctorPda,
          uhwDaoWallet: dao_wallet,
          patient: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId
        }
      })
      getAllAccounts();
    } catch (error) {}
  }

  async function updateBloodTestReport() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    var new_keypar = web3.Keypair.generate();
    const bloodTestReports = await program.account.bloodtestReport.all();
    try {
      const [bloodTestReportPda,generalConultBump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("bloodtest-report"),
          bloodTestReports[0].publicKey.toBuffer()
        ],
        programID
      );
      const technicianAccounts = await program.account.technicianProfile.all();
      const [technicianPda,technicianBump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("technician-profile"),
          technicianAccounts[0].publicKey.toBuffer()
        ],
        programID
      );
      let wbc = new anchor.BN(1000);
      let rbc = new anchor.BN(1000);
      let bp = new anchor.BN(1000);
      const blood_test_booking = await program.rpc.updateBloodtestReport(wbc,rbc,bp,'Some Comments','QmSqQjYcyYmgyjNkfXdCGU7fCB4XHB7hHxyy1c8YYLtRee',{
        accounts: {
          bloodtestReport: bloodTestReportPda,
          technicianProfile: technicianPda,
          technician: provider.wallet.publicKey
        }
      })
      getAllAccounts();
    } catch (error) {}
  }

  async function verifyBloodTestReport() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    var new_keypar = web3.Keypair.generate();
    const bloodTestReports = await program.account.bloodtestReport.all();
    try {
      const [bloodTestReportPda,generalConultBump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("bloodtest-report"),
          bloodTestReports[0].publicKey.toBuffer()
        ],
        programID
      );
      const patientAccounts = await program.account.patientProfile.all();
      const [patientPda,technicianBump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("patient-profile"),
          patientAccounts[0].publicKey.toBuffer()
        ],
        programID
      );
      let wbc = new anchor.BN(1000);
      let rbc = new anchor.BN(1000);
      let bp = new anchor.BN(1000);
      const blood_test_booking = await program.rpc.verifyBloodtestReport(wbc,rbc,bp,'Some Comments','QmSqQjYcyYmgyjNkfXdCGU7fCB4XHB7hHxyy1c8YYLtRee',{
        accounts: {
          bloodtestReport: bloodTestReportPda,
          patientProfile: patientPda,
          patientMainAccount: provider.wallet.publicKey,
          pdaPatientTokenAccount: '',
          doctorReceiveTokenAccount: '',
          pdaAccount: '',
          patient: '',
          tokenProgram: TOKEN_PROGRAM_ID
        }
      })
      getAllAccounts();
    } catch (error) {}
  }

  if (!wallet.connected) {
    /* If the user's wallet is not connected, display connect wallet button. */
    return ( 
      <div style = {
        {
          display: 'flex',
          justifyContent: 'center',
          marginTop: '100px'
        }
      } >
      <WalletMultiButton />
      </div>
    )
  } else {
    return ( 

      <div className = "App" >
        <div className='Main-header'> 
          <h2 className='pull-left full-width text-center'>Universal Health Wallet</h2>
        </div> 
        <div className='Main-body'>
          <button onClick={createDoctorAccount}>Create Doctor Account</button>
          <button onClick={createTechinicianAccount}>Create Technician Account</button>
          <button onClick={createPatientAccount}>Create Patient Account</button>
          <button onClick={createBloodTestBooking}>Create Blood test Booking</button>
          <button onClick={createGeneralConsultancy}>Create General Consultancy</button>
          <button onClick={getAllAccounts}>Get all accounts</button>
        </div>
      </div>
      );
    }
  }

  const AppWithProvider = () => ( 
    <ConnectionProvider endpoint = "https://api.devnet.solana.com" >
    <WalletProvider wallets={wallets} autoConnect >
    <WalletModalProvider >
    <App />
    </WalletModalProvider> </WalletProvider> </ConnectionProvider>
  )

  export default AppWithProvider;
