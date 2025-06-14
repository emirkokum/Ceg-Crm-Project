using AutoMapper;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.DTOs.Note;
using CegCRMAPI.Application.Repositories;
using CegCRMAPI.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Commands.Note.CreateNote
{
    public class CreateNoteCommand : IRequest<ApiResponse<NoteDto>>
    {
        public string Content { get; set; } = string.Empty;
        public Guid? CustomerId { get; set; }
        public Guid? LeadId { get; set; }
        public Guid? TicketId { get; set; }
        public Guid? SaleId { get; set; }
        public Guid? TaskId { get; set; }
    }

    public class CreateNoteCommandHandler : IRequestHandler<CreateNoteCommand, ApiResponse<NoteDto>>
    {
        private readonly INoteRepository _noteRepository;
        private readonly IMapper _mapper;

        public CreateNoteCommandHandler(INoteRepository noteRepository, IMapper mapper)
        {
            _noteRepository = noteRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse<NoteDto>> Handle(CreateNoteCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var note = _mapper.Map<Domain.Entities.Note>(request);
                await _noteRepository.AddAsync(note);
                var noteDto = _mapper.Map<NoteDto>(note);
                return ApiResponse<NoteDto>.CreateSuccess(noteDto, "Note created successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<NoteDto>.CreateError($"Failed to create note: {ex.Message}");
            }
        }
    }
} 